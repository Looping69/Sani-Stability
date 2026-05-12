import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "sani-stability-dashboard-v1";

const DEFAULT_INDICATORS = [
  {
    id: "roads",
    rank: 1,
    name: "Major road closures",
    category: "Tier 1",
    weight: 10,
    score: 0,
    icon: "Route",
    watch: "N1, N2, N3, N12, major interchanges, logistics corridors.",
    why: "Mobility disappears before most people realize risk has changed.",
  },
  {
    id: "fuel",
    rank: 2,
    name: "Fuel availability",
    category: "Tier 1",
    weight: 10,
    score: 0,
    icon: "Fuel",
    watch: "Queues, closures, rationing, tanker disruptions, station cash-only behavior.",
    why: "Fuel controls mobility, generators, logistics, and security response.",
  },
  {
    id: "political-triggers",
    rank: 3,
    name: "Political trigger dates",
    category: "Tier 1",
    weight: 10,
    score: 0,
    icon: "Siren",
    watch: "Impeachment votes, court rulings, sentencing, arrests, appeal decisions.",
    why: "Legal or political shocks can rapidly mobilize crowds and narratives.",
  },
  {
    id: "mobilization",
    rank: 4,
    name: "Coordinated protest calls",
    category: "Tier 1",
    weight: 9,
    score: 0,
    icon: "Users",
    watch: "National shutdowns, EFF calls, taxi strikes, union escalation, campus unrest.",
    why: "Organized unrest is more dangerous than scattered anger.",
  },
  {
    id: "police-capacity",
    rank: 5,
    name: "Police capacity / overstretch",
    category: "Tier 1",
    weight: 9,
    score: 0,
    icon: "Shield",
    watch: "Delayed responses, SAPS stations attacked, POP redeployment, visible withdrawal.",
    why: "If police containment fails, opportunistic crime rises fast.",
  },
  {
    id: "local-protests",
    rank: 6,
    name: "Local protest activity",
    category: "Tier 2",
    weight: 8,
    score: 0,
    icon: "Activity",
    watch: "Nearby marches, burning tyres, service-delivery protests, road blockages.",
    why: "Local events affect immediate family movement decisions.",
  },
  {
    id: "food-pharmacy",
    rank: 7,
    name: "Food / pharmacy availability",
    category: "Tier 2",
    weight: 8,
    score: 0,
    icon: "Home",
    watch: "Closures, panic buying, empty shelves, medicine shortages, distribution issues.",
    why: "Retail failure is a practical household pressure signal.",
  },
  {
    id: "firearms",
    rank: 8,
    name: "Weapon thefts / firearm seizures",
    category: "Tier 3",
    weight: 7,
    score: 0,
    icon: "AlertTriangle",
    watch: "SAPS/SANDF thefts, automatic rifles, ammunition seizures, repeated patterns.",
    why: "Violence capacity matters more when paired with political or social triggers.",
  },
  {
    id: "misinfo",
    rank: 9,
    name: "Viral misinformation spikes",
    category: "Tier 4",
    weight: 6,
    score: 0,
    icon: "Radio",
    watch: "Old riot clips, fake locations, WhatsApp voice notes, racial panic claims.",
    why: "Fear can move people faster than facts. Tedious, but true.",
  },
  {
    id: "family-readiness",
    rank: 10,
    name: "Family readiness score",
    category: "Personal",
    weight: 10,
    score: 0,
    icon: "CheckCircle2",
    watch: "Water, food, fuel, cash, medicine, documents, routes, comms, fallback plan.",
    why: "Preparedness turns bad information into better decisions.",
  },
];

const DEFAULT_CHECKLIST = [
  { id: "water", label: "7 days drinking water", done: false },
  { id: "food", label: "14 days shelf-stable food", done: false },
  { id: "meds", label: "30 days medication / first aid", done: false },
  { id: "fuel-check", label: "Vehicle above half tank", done: false },
  { id: "cash", label: "Emergency cash split safely", done: false },
  { id: "docs", label: "IDs, birth docs, medical docs backed up", done: false },
  { id: "routes", label: "3 exit routes saved offline", done: false },
  { id: "contacts", label: "Family contact tree confirmed", done: false },
  { id: "fallback", label: "Local + regional fallback locations chosen", done: false },
  { id: "comms", label: "Power banks, radios, offline maps ready", done: false },
];

function SvgIcon({ name, className = "h-5 w-5" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const icons = {
    Activity: (
      <svg {...common}><path d="M22 12h-4l-3 8L9 4l-3 8H2" /></svg>
    ),
    AlertTriangle: (
      <svg {...common}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
    ),
    CheckCircle2: (
      <svg {...common}><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
    ),
    ChevronDown: (
      <svg {...common}><path d="m6 9 6 6 6-6" /></svg>
    ),
    Circle: (
      <svg {...common}><circle cx="12" cy="12" r="9" /></svg>
    ),
    Download: (
      <svg {...common}><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>
    ),
    Fuel: (
      <svg {...common}><path d="M4 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17" /><path d="M3 22h14" /><path d="M8 7h4" /><path d="M16 8h2l2 3v7a2 2 0 0 1-2 2h-1" /></svg>
    ),
    Gauge: (
      <svg {...common}><path d="M12 14l4-4" /><path d="M3.3 19a9 9 0 1 1 17.4 0" /></svg>
    ),
    Home: (
      <svg {...common}><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></svg>
    ),
    Plus: (
      <svg {...common}><path d="M12 5v14" /><path d="M5 12h14" /></svg>
    ),
    Radio: (
      <svg {...common}><path d="M4.9 19.1a10 10 0 0 1 0-14.2" /><path d="M7.8 16.2a6 6 0 0 1 0-8.5" /><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8a6 6 0 0 1 0 8.5" /><path d="M19.1 4.9a10 10 0 0 1 0 14.2" /></svg>
    ),
    Route: (
      <svg {...common}><circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" /><path d="M9 19h5a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h6" /></svg>
    ),
    Search: (
      <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
    ),
    Shield: (
      <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>
    ),
    Siren: (
      <svg {...common}><path d="M7 18v-6a5 5 0 0 1 10 0v6" /><path d="M5 18h14" /><path d="M4 22h16" /><path d="M12 2v2" /><path d="M4.9 4.9l1.4 1.4" /><path d="M19.1 4.9l-1.4 1.4" /></svg>
    ),
    Trash2: (
      <svg {...common}><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
    ),
    TrendingUp: (
      <svg {...common}><path d="M3 17 9 11l4 4 8-8" /><path d="M14 7h7v7" /></svg>
    ),
    Upload: (
      <svg {...common}><path d="M12 21V9" /><path d="m7 14 5-5 5 5" /><path d="M5 3h14" /></svg>
    ),
    Users: (
      <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9" /><path d="M16 3.1a4 4 0 0 1 0 7.8" /></svg>
    ),
  };

  return icons[name] || icons.AlertTriangle;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function safeRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadState() {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getRiskLabel(value) {
  if (value >= 75) return { label: "RED", text: "Move early / avoid exposure", tone: "bg-red-100 text-red-800 border-red-200" };
  if (value >= 55) return { label: "ORANGE", text: "Pre-position and reduce travel", tone: "bg-orange-100 text-orange-800 border-orange-200" };
  if (value >= 30) return { label: "YELLOW", text: "Prepare and verify", tone: "bg-yellow-100 text-yellow-800 border-yellow-200" };
  return { label: "GREEN", text: "Monitor calmly", tone: "bg-emerald-100 text-emerald-800 border-emerald-200" };
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

function calculateRiskScore(indicators) {
  const totalWeight = indicators.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) return 0;
  const weighted = indicators.reduce((sum, item) => sum + item.score * item.weight, 0);
  return Math.round((weighted / (totalWeight * 5)) * 100);
}

function calculateReadinessScore(checklist) {
  if (!checklist.length) return 0;
  const done = checklist.filter((item) => item.done).length;
  return Math.round((done / checklist.length) * 100);
}

function detectClusters(indicators) {
  const highTier = indicators.filter((item) => ["Tier 1", "Tier 2"].includes(item.category) && item.score >= 3);
  const criticalTierOne = indicators.filter((item) => item.category === "Tier 1" && item.score >= 4);
  return {
    highTierCount: highTier.length,
    criticalTierOneCount: criticalTierOne.length,
    triggered: highTier.length >= 3 || criticalTierOne.length >= 2,
  };
}

function runSelfTests() {
  const allZeroRisk = calculateRiskScore(DEFAULT_INDICATORS) === 0;
  const allMaxRisk = calculateRiskScore(DEFAULT_INDICATORS.map((item) => ({ ...item, score: 5 }))) === 100;
  const halfReadiness = calculateReadinessScore(DEFAULT_CHECKLIST.map((item, index) => ({ ...item, done: index < DEFAULT_CHECKLIST.length / 2 }))) === 50;
  const clusterByHighTier = detectClusters(DEFAULT_INDICATORS.map((item, index) => ({ ...item, score: index < 3 ? 3 : 0 }))).triggered === true;
  const clusterByCriticalTierOne = detectClusters(DEFAULT_INDICATORS.map((item, index) => ({ ...item, score: index < 2 ? 4 : 0 }))).triggered === true;
  const noCluster = detectClusters(DEFAULT_INDICATORS).triggered === false;

  return [
    { name: "Risk is 0 when all indicators are 0", pass: allZeroRisk },
    { name: "Risk is 100 when all indicators are 5", pass: allMaxRisk },
    { name: "Readiness is 50% when half checklist is done", pass: halfReadiness },
    { name: "Cluster triggers when 3 high Tier 1/2 signals exist", pass: clusterByHighTier },
    { name: "Cluster triggers when 2 critical Tier 1 signals exist", pass: clusterByCriticalTierOne },
    { name: "Cluster stays false with no elevated signals", pass: noCluster },
  ];
}

function App() {
  const [indicators, setIndicators] = useState(DEFAULT_INDICATORS);
  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST);
  const [events, setEvents] = useState([
    {
      id: safeRandomId(),
      date: todayStamp(),
      title: "Dashboard created",
      source: "Manual",
      confidence: "Medium",
      note: "Initial mobile-first MVP. Replace with verified events as evidence comes in.",
      tags: "setup",
    },
  ]);
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [showTests, setShowTests] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", source: "", confidence: "Medium", note: "", tags: "" });

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setIndicators(saved.indicators || DEFAULT_INDICATORS);
      setChecklist(saved.checklist || DEFAULT_CHECKLIST);
      setEvents(saved.events || []);
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ indicators, checklist, events }));
      }
    } catch {
      // Storage can fail in restricted preview environments. The app should still run.
    }
  }, [indicators, checklist, events]);

  const riskScore = useMemo(() => calculateRiskScore(indicators), [indicators]);
  const readinessScore = useMemo(() => calculateReadinessScore(checklist), [checklist]);
  const clusteredWarnings = useMemo(() => detectClusters(indicators), [indicators]);
  const selfTests = useMemo(() => runSelfTests(), []);
  const testsPassed = selfTests.every((test) => test.pass);
  const risk = getRiskLabel(riskScore);

  const filteredIndicators = indicators.filter((item) =>
    `${item.name} ${item.category} ${item.watch} ${item.why}`.toLowerCase().includes(query.toLowerCase())
  );

  function updateIndicator(id, value) {
    setIndicators((prev) => prev.map((item) => (item.id === id ? { ...item, score: clamp(value, 0, 5) } : item)));
  }

  function toggleChecklist(id) {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  }

  function addEvent() {
    if (!newEvent.title.trim()) return;
    setEvents((prev) => [
      {
        id: safeRandomId(),
        date: todayStamp(),
        title: newEvent.title.trim(),
        source: newEvent.source.trim() || "Manual",
        confidence: newEvent.confidence,
        note: newEvent.note.trim(),
        tags: newEvent.tags.trim(),
      },
      ...prev,
    ]);
    setNewEvent({ title: "", source: "", confidence: "Medium", note: "", tags: "" });
  }

  function deleteEvent(id) {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }

  function exportData() {
    const payload = JSON.stringify({ exportedAt: new Date().toISOString(), indicators, checklist, events }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sani-stability-dashboard-${todayStamp()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.indicators) setIndicators(parsed.indicators);
        if (parsed.checklist) setChecklist(parsed.checklist);
        if (parsed.events) setEvents(parsed.events);
      } catch {
        alert("Import failed. The file is not valid dashboard JSON.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">S.A.N.I Stability Intelligence</p>
              <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-4xl">Mobile Risk Dashboard</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                A calm, evidence-first dashboard for turning messy signals into clear family decisions.
              </p>
            </div>
            <SvgIcon name="Gauge" className="mt-1 h-8 w-8 text-slate-300" />
          </div>
        </motion.header>

        <section className="grid gap-3 sm:grid-cols-3">
          <Card className="rounded-3xl border-white/10 bg-white/10 text-slate-100 shadow-xl">
            <CardContent className="p-4">
              <p className="text-sm text-slate-300">National risk</p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-4xl font-black">{riskScore}</span>
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${risk.tone}`}>{risk.label}</span>
              </div>
              <p className="mt-2 text-sm text-slate-300">{risk.text}</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-white/10 bg-white/10 text-slate-100 shadow-xl">
            <CardContent className="p-4">
              <p className="text-sm text-slate-300">Family readiness</p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-4xl font-black">{readinessScore}%</span>
                <SvgIcon name="CheckCircle2" className="h-8 w-8 text-slate-300" />
              </div>
              <p className="mt-2 text-sm text-slate-300">Target: 80% before any serious trigger cluster.</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-white/10 bg-white/10 text-slate-100 shadow-xl">
            <CardContent className="p-4">
              <p className="text-sm text-slate-300">Cluster detection</p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-4xl font-black">{clusteredWarnings.highTierCount}</span>
                <SvgIcon name="TrendingUp" className="h-8 w-8 text-slate-300" />
              </div>
              <p className="mt-2 text-sm text-slate-300">
                {clusteredWarnings.triggered ? "Trigger cluster active. Pre-position calmly." : "No major cluster yet."}
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Decision Ladder</h2>
              <p className="text-sm text-slate-300">Use thresholds, not adrenaline. A rare innovation, apparently.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={exportData} className="rounded-2xl bg-slate-100 text-slate-950 hover:bg-white">
                <SvgIcon name="Download" className="mr-2 h-4 w-4" /> Export
              </Button>
              <label className="inline-flex cursor-pointer items-center rounded-2xl bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700">
                <SvgIcon name="Upload" className="mr-2 h-4 w-4" /> Import
                <input type="file" accept="application/json" onChange={importData} className="hidden" />
              </label>
              <Button onClick={() => setShowTests((value) => !value)} className="rounded-2xl bg-slate-800 text-slate-100 hover:bg-slate-700">
                Tests: {testsPassed ? "Pass" : "Fail"}
              </Button>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {[
              ["GREEN", "Monitor weekly"],
              ["YELLOW", "Top up supplies"],
              ["ORANGE", "Reduce exposure"],
              ["RED", "Move early"],
            ].map(([label, text]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-slate-900 p-3">
                <p className="text-sm font-black">{label}</p>
                <p className="mt-1 text-xs text-slate-300">{text}</p>
              </div>
            ))}
          </div>

          {showTests && (
            <div className="mt-4 rounded-2xl bg-slate-950 p-3">
              <p className="text-sm font-bold">Self-tests</p>
              <div className="mt-2 space-y-2">
                {selfTests.map((test) => (
                  <div key={test.name} className="flex items-center gap-2 text-xs text-slate-300">
                    <SvgIcon name={test.pass ? "CheckCircle2" : "AlertTriangle"} className="h-4 w-4" />
                    <span>{test.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-5">
          <div className="mb-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <SvgIcon name="Search" className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search indicators..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="grid gap-3">
            {filteredIndicators.map((item) => {
              const isOpen = expandedId === item.id;
              return (
                <Card key={item.id} className="rounded-3xl border-white/10 bg-white/10 text-slate-100 shadow-xl">
                  <CardContent className="p-4">
                    <button
                      onClick={() => setExpandedId(isOpen ? null : item.id)}
                      className="flex w-full items-start justify-between gap-3 text-left"
                    >
                      <div className="flex gap-3">
                        <div className="rounded-2xl bg-slate-950 p-2">
                          <SvgIcon name={item.icon} className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-slate-400">#{item.rank}</span>
                            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{item.category}</span>
                          </div>
                          <h3 className="mt-1 font-bold">{item.name}</h3>
                        </div>
                      </div>
                      <SvgIcon name="ChevronDown" className={`h-5 w-5 transition ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Signal score</span>
                        <span>{item.score}/5</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        value={item.score}
                        onChange={(event) => updateIndicator(item.id, Number(event.target.value))}
                        className="mt-2 w-full accent-slate-100"
                      />
                    </div>

                    {isOpen && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 space-y-3 text-sm text-slate-300">
                        <div className="rounded-2xl bg-slate-950 p-3">
                          <p className="font-semibold text-slate-100">Why it matters</p>
                          <p className="mt-1">{item.why}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-950 p-3">
                          <p className="font-semibold text-slate-100">What to watch</p>
                          <p className="mt-1">{item.watch}</p>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card className="rounded-3xl border-white/10 bg-white/10 text-slate-100 shadow-xl">
            <CardContent className="p-4">
              <h2 className="text-lg font-bold">Family readiness</h2>
              <p className="mt-1 text-sm text-slate-300">Personal resilience checklist. No bunker cosplay required.</p>
              <div className="mt-4 space-y-2">
                {checklist.map((item) => (
                  <button key={item.id} onClick={() => toggleChecklist(item.id)} className="flex w-full items-center gap-3 rounded-2xl bg-slate-950 p-3 text-left text-sm">
                    <SvgIcon name={item.done ? "CheckCircle2" : "Circle"} className={`h-5 w-5 ${item.done ? "" : "text-slate-500"}`} />
                    <span className={item.done ? "text-slate-300 line-through" : "text-slate-100"}>{item.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-white/10 bg-white/10 text-slate-100 shadow-xl">
            <CardContent className="p-4">
              <h2 className="text-lg font-bold">Evidence log</h2>
              <p className="mt-1 text-sm text-slate-300">Add only verified or clearly labelled claims. Radical concept, apparently.</p>

              <div className="mt-4 space-y-2">
                <input
                  value={newEvent.title}
                  onChange={(event) => setNewEvent({ ...newEvent, title: event.target.value })}
                  placeholder="Event title"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none placeholder:text-slate-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={newEvent.source}
                    onChange={(event) => setNewEvent({ ...newEvent, source: event.target.value })}
                    placeholder="Source"
                    className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none placeholder:text-slate-500"
                  />
                  <select
                    value={newEvent.confidence}
                    onChange={(event) => setNewEvent({ ...newEvent, confidence: event.target.value })}
                    className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <textarea
                  value={newEvent.note}
                  onChange={(event) => setNewEvent({ ...newEvent, note: event.target.value })}
                  placeholder="Notes / verification details"
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none placeholder:text-slate-500"
                />
                <input
                  value={newEvent.tags}
                  onChange={(event) => setNewEvent({ ...newEvent, tags: event.target.value })}
                  placeholder="Tags: roads, fuel, politics..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none placeholder:text-slate-500"
                />
                <Button onClick={addEvent} className="w-full rounded-2xl bg-slate-100 text-slate-950 hover:bg-white">
                  <SvgIcon name="Plus" className="mr-2 h-4 w-4" /> Add evidence
                </Button>
              </div>

              <div className="mt-4 space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="rounded-2xl bg-slate-950 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-500">{event.date} · {event.confidence} confidence</p>
                        <h3 className="mt-1 font-bold">{event.title}</h3>
                        <p className="mt-1 text-xs text-slate-400">Source: {event.source}</p>
                      </div>
                      <button onClick={() => deleteEvent(event.id)} className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white">
                        <SvgIcon name="Trash2" className="h-4 w-4" />
                      </button>
                    </div>
                    {event.note && <p className="mt-2 text-sm text-slate-300">{event.note}</p>}
                    {event.tags && <p className="mt-2 text-xs text-slate-500">Tags: {event.tags}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 text-center text-xs text-slate-400">
          <p>Decision advantage over panic. Evidence over rumor. Calm over chaos.</p>
          <p className="mt-2 font-mono">( |╲ ) / (│╲)</p>
        </footer>
      </section>
    </main>
  );
}

export default App;
