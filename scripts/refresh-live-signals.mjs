import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, "../src/data/liveSignals.json");

const SEARCH_ROOT =
  "https://news.google.com/rss/search?hl=en-ZA&gl=ZA&ceid=ZA:en&q=";

const INDICATOR_FEEDS = [
  {
    id: "roads",
    sourceIds: ["google-news-rss", "sanews", "sanral-reference"],
    queries: [
      "South Africa road closure protest",
      "South Africa N3 closure",
      "South Africa road closures flooding",
    ],
  },
  {
    id: "fuel",
    sourceIds: ["google-news-rss", "gov-fuel"],
    queries: [
      "South Africa fuel supply prices government",
      "South Africa fuel shortage stations",
      "South Africa diesel supply disruptions",
    ],
  },
  {
    id: "political-triggers",
    sourceIds: ["google-news-rss", "parliament-press"],
    queries: [
      "South Africa court ruling protest parliament",
      "South Africa impeachment vote unrest",
      "South Africa arrest sparks protest",
    ],
  },
  {
    id: "mobilization",
    sourceIds: ["google-news-rss", "saps-newsroom"],
    queries: [
      "South Africa taxi strike protest",
      "South Africa shutdown march protest",
      "South Africa anti immigrant protest",
    ],
  },
  {
    id: "police-capacity",
    sourceIds: ["google-news-rss", "saps-newsroom", "parliament-press"],
    queries: [
      "South Africa police overstretched protest",
      "South Africa SAPS operation statement",
      "South Africa police capacity inquiry",
    ],
  },
  {
    id: "local-protests",
    sourceIds: ["google-news-rss", "parliament-press"],
    queries: [
      "South Africa local protest road blocked",
      "South Africa service delivery protest road closure",
      "South Africa violent protest town roads",
    ],
  },
  {
    id: "food-pharmacy",
    sourceIds: ["google-news-rss", "pmbejd-data"],
    queries: [
      "South Africa pharmacy shortages",
      "South Africa food shortages stores",
      "South Africa panic buying shelves",
    ],
  },
  {
    id: "firearms",
    sourceIds: ["google-news-rss", "saps-newsroom"],
    queries: [
      "South Africa firearm seizure SAPS",
      "South Africa weapons cache police",
      "South Africa rifle seizure arrest",
    ],
  },
  {
    id: "misinfo",
    sourceIds: ["google-news-rss", "gov-cabinet"],
    queries: [
      "South Africa fake videos misinformation protests",
      "South Africa WhatsApp panic fake news",
      "South Africa false protest warning police",
    ],
  },
];

function decodeEntities(value) {
  return value
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function readTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}(?: [^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function parseGoogleNewsSource(title) {
  const parts = title.split(" - ");
  if (parts.length < 2) return { cleanTitle: title, publisher: "Unknown publisher" };
  return {
    cleanTitle: parts.slice(0, -1).join(" - ").trim(),
    publisher: parts.at(-1)?.trim() || "Unknown publisher",
  };
}

function parseRss(xml, query) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((match) => {
    const block = match[1];
    const title = readTag(block, "title");
    const link = readTag(block, "link");
    const pubDate = readTag(block, "pubDate");
    const description = readTag(block, "description");
    const source = parseGoogleNewsSource(title);

    if (!title || !link) return null;

    return {
      title: source.cleanTitle,
      publisher: source.publisher,
      url: link,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : null,
      note: description,
      matchedQuery: query,
    };
  });

  return items.filter(Boolean);
}

function dedupe(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.url}::${item.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function ageHours(dateValue) {
  if (!dateValue) return Number.POSITIVE_INFINITY;
  return (Date.now() - new Date(dateValue).getTime()) / (1000 * 60 * 60);
}

function scoreFromEvidence(items) {
  const last24 = items.filter((item) => ageHours(item.publishedAt) <= 24).length;
  const last72 = items.filter((item) => ageHours(item.publishedAt) <= 72).length;
  const lastWeek = items.filter((item) => ageHours(item.publishedAt) <= 168).length;

  if (last72 >= 6 || last24 >= 3) return 5;
  if (last72 >= 4 || last24 >= 2) return 4;
  if (last72 >= 2 || lastWeek >= 4) return 3;
  if (lastWeek >= 2 || last24 >= 1) return 2;
  if (lastWeek >= 1) return 1;
  return 0;
}

function summaryFor(items) {
  if (!items.length) {
    return "No recent matching items were found in the tracked feed window.";
  }

  const newest = items[0];
  return `${items.length} recent items matched. Newest tracked item: \"${newest.title}\".`;
}

async function fetchFeed(query) {
  const response = await fetch(`${SEARCH_ROOT}${encodeURIComponent(query)}`, {
    headers: {
      "User-Agent": "Sani-Stability/1.1 (+https://github.com/WimpyvL/Sani-Stability)",
    },
  });

  if (!response.ok) {
    throw new Error(`Feed request failed for \"${query}\" with ${response.status}`);
  }

  return response.text();
}

async function buildSnapshot() {
  const indicators = {};

  for (const config of INDICATOR_FEEDS) {
    const collected = [];

    for (const query of config.queries) {
      const xml = await fetchFeed(query);
      collected.push(...parseRss(xml, query));
    }

    const deduped = dedupe(collected)
      .sort((left, right) => {
        const leftDate = left.publishedAt ? new Date(left.publishedAt).getTime() : 0;
        const rightDate = right.publishedAt ? new Date(right.publishedAt).getTime() : 0;
        return rightDate - leftDate;
      })
      .slice(0, 8);

    indicators[config.id] = {
      updatedAt: new Date().toISOString(),
      score: scoreFromEvidence(deduped),
      summary: summaryFor(deduped),
      sourceIds: config.sourceIds,
      evidence: deduped,
    };
  }

  return {
    generatedAt: new Date().toISOString(),
    feedStatus: "live",
    feedMode: "scheduled-refresh",
    indicators,
  };
}

async function main() {
  const snapshot = await buildSnapshot();
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
