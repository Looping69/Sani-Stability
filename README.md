# S.A.N.I Stability Dashboard

An evidence-first mobile dashboard for South African household risk monitoring.

## What changed

The original app shape was decent, but the signal layer was mostly pretend: manual sliders, a seed event, and no reliable path for pulling current evidence. This version keeps the dashboard UX and swaps the fake core out for a simple static-data pipeline:

- `src/data/liveSignals.json` is the current snapshot the UI reads.
- `scripts/refresh-live-signals.mjs` refreshes that snapshot from public feeds.
- `.github/workflows/refresh-live-signals.yml` can regenerate the snapshot on a schedule in GitHub Actions.

The browser does not fetch public news feeds directly. That was an intentional choice. Public RSS and government endpoints are inconsistent on CORS, so browser-side fetches would be brittle. Refreshing server-side and shipping a clean JSON snapshot is the boring, reliable option.

## How it works

1. The refresh script queries Google News RSS for focused South Africa signal searches.
2. It groups results into indicator buckets such as roads, fuel, protests, police, firearms, and misinformation.
3. It assigns a 0-5 indicator score from recency and volume.
4. It writes a single snapshot file that the React app renders.

## Local use

```bash
npm install
npm run dev
```

To refresh the snapshot manually:

```bash
npm run refresh-data
```

## Notes

- Family readiness remains local and manual on purpose.
- Manual notes are stored in the browser and exported separately from the live snapshot.
- The dashboard is a decision support tool, not a prediction engine.
