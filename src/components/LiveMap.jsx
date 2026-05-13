import React, { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { Card, CardContent } from "@/components/ui/Card";
import { useIndicators } from "@/context/IndicatorsProvider";
import { buildMapIncidents, summariseMapIncidents } from "@/utils/geoIncidents";

const SOUTH_AFRICA_CENTER = [-29, 24];

function severityClass(level) {
  if (level === "high") return "bg-red-500";
  if (level === "medium") return "bg-orange-500";
  return "bg-sky-500";
}

export function LiveMap() {
  const mapNode = useRef(null);
  const mapInstance = useRef(null);
  const markerLayer = useRef(null);
  const [selected, setSelected] = useState(null);

  const { indicators, generatedAt } = useIndicators();
  const incidents = useMemo(() => buildMapIncidents(indicators), [indicators]);
  const summary = useMemo(() => summariseMapIncidents(incidents), [incidents]);

  useEffect(() => {
    if (!mapNode.current || mapInstance.current) return;

    const map = L.map(mapNode.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(SOUTH_AFRICA_CENTER, 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "OpenStreetMap contributors",
    }).addTo(map);

    markerLayer.current = L.layerGroup().addTo(map);
    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
      markerLayer.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !markerLayer.current) return;

    markerLayer.current.clearLayers();

    incidents.forEach((incident) => {
      const marker = L.circleMarker([incident.lat, incident.lng], {
        radius: incident.severity === "high" ? 10 : incident.severity === "medium" ? 8 : 6,
        color: incident.color,
        fillColor: incident.color,
        fillOpacity: 0.85,
        weight: 2,
      });

      marker.on("click", () => setSelected(incident));
      marker.addTo(markerLayer.current);
    });
  }, [incidents]);

  return (
    <Card className="h-full overflow-hidden border-white/10 bg-white/8 text-slate-100 shadow-xl">
      <CardContent className="flex h-full flex-col p-0">
        <div className="border-b border-white/10 p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Operational map</p>
              <h2 className="mt-1 text-xl font-bold sm:text-2xl">Live evidence geography</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Free OpenStreetMap layer with pins generated from evidence that has a known or inferred location.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs sm:min-w-64">
              <div className="rounded-2xl bg-slate-950/70 p-3">
                <div className="text-lg font-black text-red-400">{summary.bySeverity.high}</div>
                <div className="text-slate-500">High</div>
              </div>
              <div className="rounded-2xl bg-slate-950/70 p-3">
                <div className="text-lg font-black text-orange-400">{summary.bySeverity.medium}</div>
                <div className="text-slate-500">Medium</div>
              </div>
              <div className="rounded-2xl bg-slate-950/70 p-3">
                <div className="text-lg font-black text-sky-400">{summary.bySeverity.low}</div>
                <div className="text-slate-500">Low</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
            {Object.entries(summary.byProvince).map(([province, count]) => (
              <span key={province} className="rounded-full bg-slate-950/70 px-3 py-1">
                {province}: {count}
              </span>
            ))}
          </div>
        </div>

        <div className="grid min-h-[620px] flex-1 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div ref={mapNode} className="min-h-[420px] bg-slate-950 lg:min-h-[620px]" />

          <aside className="border-t border-white/10 bg-slate-950/80 p-4 lg:border-l lg:border-t-0">
            {selected ? (
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <span className={`h-2.5 w-2.5 rounded-full ${severityClass(selected.severity)}`} />
                  {selected.severity} severity
                </div>
                <h3 className="mt-3 text-lg font-bold leading-tight">{selected.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{selected.publisher}</p>
                <div className="mt-4 rounded-2xl bg-white/6 p-3 text-sm leading-6 text-slate-300">
                  {selected.note || "No additional evidence note was provided."}
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Location</dt>
                    <dd className="mt-1 text-slate-200">{selected.locationLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Geo confidence</dt>
                    <dd className="mt-1 text-slate-200">{selected.geoConfidence}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Indicator</dt>
                    <dd className="mt-1 text-slate-200">{selected.indicatorName}</dd>
                  </div>
                </dl>
                {selected.url ? (
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-white"
                  >
                    Open source
                  </a>
                ) : null}
              </div>
            ) : (
              <div className="flex h-full min-h-56 flex-col justify-center rounded-3xl border border-dashed border-white/10 p-4 text-center">
                <p className="text-sm font-semibold text-slate-200">Select a pin</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Click any mapped incident to inspect source, confidence, category, and location. Precision is labelled because magical thinking is not a geospatial strategy.
                </p>
              </div>
            )}

            <div className="mt-6 border-t border-white/10 pt-4 text-xs leading-5 text-slate-500">
              Snapshot: {new Date(generatedAt).toLocaleString()}
            </div>
          </aside>
        </div>
      </CardContent>
    </Card>
  );
}
