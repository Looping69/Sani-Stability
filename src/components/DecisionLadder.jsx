import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { SelfTestsModal } from "./SelfTestsModal";
import { useIndicators } from "@/context/IndicatorsProvider";
import { useChecklist } from "@/context/ChecklistProvider";
import { useEvents } from "@/context/EventsProvider";
import { runSelfTests } from "@/utils/calculations";
import { todayStamp } from "@/utils/helpers";

export function DecisionLadder() {
  const { indicators, setAllIndicators } = useIndicators();
  const { checklist, setAllChecklist } = useChecklist();
  const { events, setAllEvents } = useEvents();
  const [showTests, setShowTests] = useState(false);

  const testsPassed = useMemo(() => runSelfTests().every((t) => t.pass), []);

  function exportData() {
    const payload = JSON.stringify(
      { exportedAt: new Date().toISOString(), indicators, checklist, events },
      null,
      2
    );
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
        if (parsed.indicators) setAllIndicators(parsed.indicators);
        if (parsed.checklist) setAllChecklist(parsed.checklist);
        if (parsed.events) setAllEvents(parsed.events);
      } catch {
        alert("Import failed. The file is not valid dashboard JSON.");
      }
    };
    reader.readAsText(file);
  }

  const levels = [
    ["GREEN", "Monitor weekly"],
    ["YELLOW", "Top up supplies"],
    ["ORANGE", "Reduce exposure"],
    ["RED", "Move early"],
  ];

  return (
    <>
      <section className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">Decision Ladder</h2>
            <p className="text-sm text-slate-300">
              Use thresholds, not adrenaline. A rare innovation, apparently.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={exportData}
              className="bg-slate-100 text-slate-950 hover:bg-white"
            >
              <SvgIcon name="Download" className="mr-2 h-4 w-4" /> Export
            </Button>
            <label className="inline-flex cursor-pointer items-center rounded-2xl bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 transition-colors">
              <SvgIcon name="Upload" className="mr-2 h-4 w-4" /> Import
              <input
                type="file"
                accept="application/json"
                onChange={importData}
                className="hidden"
              />
            </label>
            <Button
              onClick={() => setShowTests(true)}
              className="bg-slate-800 text-slate-100 hover:bg-slate-700"
            >
              Tests: {testsPassed ? "Pass" : "Fail"}
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {levels.map(([label, text]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-slate-900 p-3">
              <p className="text-sm font-black">{label}</p>
              <p className="mt-1 text-xs text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <SelfTestsModal isOpen={showTests} onClose={() => setShowTests(false)} />
    </>
  );
}
