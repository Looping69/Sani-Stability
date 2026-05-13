import React, { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { Card, CardContent } from "@/components/ui/Card";
import { useIndicators } from "@/context/IndicatorsProvider";
import { buildMapIncidents, summariseMapIncidents } from "@/utils/geoIncidents";

const SOUTH_AFRICA_CENTER = [-29, 24];
const SEVERITIES = ["high", "medium", "low"];

function severityClass(level) {
  if (level === "high") return "bg-red-500";
  if (level === "medium") return "bg-orange-500";
  return "bg-sky-500";
}

function ToggleChip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "border-sky-300/60 bg-sky-300/15 text-sky-100"
          : "border-white/10 bg-slate-950/60 text-slate-400 hover:border-white/20 hover:text-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function IncidentButton({ incident, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-3 text-left transition-colors ${
        active
          ? "border-sky-300/60 bg-sky-300/10"
          : "border-white/8 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${severityClass(incident.severity)}`} />
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-[0.16em] text-slate-500">
            {incident.locationLabel} · {incident.indicatorName}
          </p>
          <h4 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-slate-100">
            {incident.title}
          </h4>
          <p className="mt-1 truncate text-xs text-slate-500">{incident.publisher}</p>
        </div>
      </div>
    </button>
  );
}

export function LiveMap() {
  const mapNode = useRef(null);
  const mapInstance = useRef(null);
  const markerLayer = useRef(null);
  const markerRefs = useRef(new Map());
  const [selected, setSelected] = useState(null);
  const [activeSeverities, setActiveSeverities] = useState(new Set(SEVERITIES));
  const [activeCategories, setActiveCategories] = useState(new Set());

  const { indicators, generatedAt } = useIndicators();
  const incidents = useMemo(() => buildMapIncidents(indicators), [indicators]);

  const categories = useMemo(() => {
    const byCategory = new Map();
    incidents.forEach((incident) => {
      if (!byCategory.has(incident.category)) {
        byCategory.set(incident.category, {
          id: incident.category,
          name: incident.indicatorName,
          color: incident.color,
          count: 0,
        });
      }
      byCategory.get(incident.category).count += 1;
    });
    return Array.from(byCategory.values());
  }, [incidents]);

  useEffect(() => {
    if (!activeCategories.size && categories.length) {
      setActiveCategories(new Set(categories.map((category) => category.id)));
    }
  }, [categories, activeCategories.size]);

  const filteredIncidents = useMemo(
    () =>
      incidents.filter(
        (incident) => activeSeverities.has(incident.severity) && activeCategories.has(incident.category)
      ),
    [incidents, activeSeverities, activeCategories]
  );

  const summary = useMemo(() => summariseMapIncidents(filteredIncidents), [filteredIncidents]);

  function toggleSeverity(severity) {
    setActiveSeverities((current) => {
      const next = new Set(current);
      if (next.has(severity)) next.delete(severity);
      else next.add(severity);
      return next;
    });
  }

  function toggleCategory(categoryId) {
    setActiveCategories((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }

  function selectIncident(incident) {
    setSelected(incident);
    const map = mapInstance.current;
    const marker = markerRefs.current.get(incident.id);
    if (map && marker) {
      map.setView([incident.lat, incident.lng], Math.max(map.getZoom(), 7), { animate: true });
      marker.openPopup();
    }
  }

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
      markerRefs.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !markerLayer.current) return;

    markerLayer.current.clearLayers();
    markerRefs.current.clear();

    filteredIncidents.forEach((incident) => {
      const marker = L.circleMarker([incident.lat, incident.lng], {
        radius: incident.severity === "high" ? 10 : incident.severity === "medium" ? 8 : 6,
        color: incident.color,
        fillColor: incident.color,
        fillOpacity: 0.85,
        weight: selected?.id === incident.id ? 4 : 2,
      });

      marker.bindPopup(`<strong>${incident.locationLabel}</strong><br>${incident.title}`);
      marker.on("click", () => setSelected(incident));
      marker.addTo(markerLayer.current);
      markerRefs.current.set(incident.id, marker);
    });

    if (selected && !filteredIncidents.some((incident) => incident.id === selected.id)) {
      setSelected(null);
    }
  }, [filteredIncidents, selected]);

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

          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {SEVERITIES.map((severity) => (
                <ToggleChip
                  key={severity}
                  active={activeSeverities.has(severity)}
                  onClick={() => toggleSeverity(severity)}
                >
                  {severity}
                </ToggleChip>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <ToggleChip
                  key={category.id}
                  active={activeCategories.has(category.id)}
                  onClick={() => toggleCategory(category.id)}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
                    {category.name} ({category.count})
                  </span>
                </ToggleChip>
              ))}
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

        <div className="grid min-h-[720px] flex-1 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div ref={mapNode} className="min-h-[420px] bg-slate-950 lg:min-h-[720px]" />

          <aside className="flex min-h-0 flex-col border-t border-white/10 bg-slate-950/80 lg:border-l lg:border-t-0">
            <div className="border-b border-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                {filteredIncidents.length} mapped items
              </p>
              <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1 lg:max-h-72">
                {filteredIncidents.length ? (
                  filteredIncidents.map((incident) => (
                    <IncidentButton
                      key={incident.id}
                      incident={incident}
                      active={selected?.id === incident.id}
                      onClick={() => selectIncident(incident)}
                    />
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
                    No incidents match the current filters.
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 p-4">
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
                  <p className="text-sm font-semibold text-slate-200">Select a pin or incident</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Inspect source, confidence, category, and location. Precision is labelled because magical thinking is not a geospatial strategy.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-4 text-xs leading-5 text-slate-500">
              Snapshot: {new Date(generatedAt).toLocaleString()}
            </div>
          </aside>
        </div>
      </CardContent>
    </Card>
  );
}
