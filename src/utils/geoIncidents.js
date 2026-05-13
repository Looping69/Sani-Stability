const LOCATION_INDEX = [
  {
    key: "durban",
    label: "Durban",
    province: "KwaZulu-Natal",
    lat: -29.8587,
    lng: 31.0218,
    aliases: ["durban", "ethekwini"],
  },
  {
    key: "klerksdorp",
    label: "Klerksdorp",
    province: "North West",
    lat: -26.8521,
    lng: 26.6667,
    aliases: ["klerksdorp"],
  },
  {
    key: "nyanga",
    label: "Nyanga",
    province: "Western Cape",
    lat: -33.9961,
    lng: 18.5815,
    aliases: ["nyanga"],
  },
  {
    key: "western-cape",
    label: "Western Cape",
    province: "Western Cape",
    lat: -33.9249,
    lng: 18.4241,
    aliases: ["western cape", "cape town"],
  },
  {
    key: "gauteng",
    label: "Gauteng",
    province: "Gauteng",
    lat: -26.2041,
    lng: 28.0473,
    aliases: ["gauteng", "johannesburg", "joburg", "pretoria", "tshwane"],
  },
  {
    key: "kwazulu-natal",
    label: "KwaZulu-Natal",
    province: "KwaZulu-Natal",
    lat: -29.6,
    lng: 30.4,
    aliases: ["kwazulu-natal", "kzn", "pietermaritzburg"],
  },
  {
    key: "limpopo",
    label: "Limpopo",
    province: "Limpopo",
    lat: -23.9045,
    lng: 29.4689,
    aliases: ["limpopo", "polokwane"],
  },
  {
    key: "n3",
    label: "N3 corridor",
    province: "KwaZulu-Natal / Gauteng corridor",
    lat: -29.0,
    lng: 30.2,
    aliases: ["n3", "market road"],
  },
  {
    key: "south-africa",
    label: "South Africa",
    province: "National",
    lat: -30.5595,
    lng: 22.9375,
    aliases: ["south africa", "six provinces", "national"],
  },
];

const CATEGORY_COLORS = {
  roads: "#f97316",
  fuel: "#38bdf8",
  "political-triggers": "#a855f7",
  mobilization: "#ef4444",
  "police-capacity": "#eab308",
  "local-protests": "#f97316",
  "food-pharmacy": "#22c55e",
  firearms: "#dc2626",
  misinfo: "#64748b",
};

function normaliseText(value) {
  return String(value || "").toLowerCase();
}

function findLocation(evidence) {
  const haystack = normaliseText(`${evidence.title} ${evidence.note} ${evidence.publisher} ${evidence.matchedQuery}`);

  for (const location of LOCATION_INDEX) {
    if (location.aliases.some((alias) => haystack.includes(alias))) {
      return {
        ...location,
        geoConfidence: location.key === "south-africa" ? "national" : "inferred",
      };
    }
  }

  return null;
}

function getSeverity(score) {
  if (score >= 4) return "high";
  if (score >= 2) return "medium";
  return "low";
}

export function buildMapIncidents(indicators) {
  return indicators.flatMap((indicator) => {
    const score = Number.isFinite(indicator.score) ? indicator.score : 0;
    const evidence = Array.isArray(indicator.evidence) ? indicator.evidence : [];

    return evidence
      .map((item, index) => {
        const location = findLocation(item);
        if (!location) return null;

        return {
          id: `${indicator.id}-${index}-${location.key}`,
          indicatorId: indicator.id,
          indicatorName: indicator.name,
          category: indicator.id,
          color: CATEGORY_COLORS[indicator.id] || "#94a3b8",
          severity: getSeverity(score),
          score,
          title: item.title,
          publisher: item.publisher || "Unknown source",
          url: item.url,
          publishedAt: item.publishedAt,
          note: item.note,
          locationLabel: location.label,
          province: location.province,
          lat: location.lat,
          lng: location.lng,
          geoConfidence: location.geoConfidence,
        };
      })
      .filter(Boolean);
  });
}

export function summariseMapIncidents(incidents) {
  const bySeverity = incidents.reduce(
    (acc, item) => {
      acc[item.severity] = (acc[item.severity] || 0) + 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );

  const byProvince = incidents.reduce((acc, item) => {
    acc[item.province] = (acc[item.province] || 0) + 1;
    return acc;
  }, {});

  return { bySeverity, byProvince };
}
