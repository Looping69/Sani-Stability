import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { SelfTestsModal } from "./SelfTestsModal";
import { useChecklist } from "@/context/ChecklistProvider";
import { useEvents } from "@/context/EventsProvider";
import { useIndicators } from "@/context/IndicatorsProvider";
import { runSelfTests } from "@/utils/calculations";
import { formatDateTime, todayStamp } from "@/utils/helpers";

export function DecisionLadder() {
  const { checklist, setAllChecklist } = useChecklist();
  const { events, setAllEvents } = useEvents();
  const { generatedAt, totalEvidence } = useIndicators();
  const [showTests, setShowTests] = useState(false);

  const testsPassed = useMemo(() => runSelfTests().every((test) => test.pass), []);

  function exportData() {
    const payload = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        checklist,
        manualEvents: events,
      },
      null,
      2
    );

    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `sani-household-state-${todayStamp()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function importData(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.checklist) setAllChecklist(parsed.checklist);
        if (parsed.manualEvents || parsed.events) {
          setAllEvents(parsed.manualEvents || parsed.events);
        }
      } catch {
        alert("Import failed. This file is not valid dashboard state.");
      }
    };
    reader.readAsText(file);
  }

  const levels = [
    ["GREEN", "Monitor weekly and keep money, fuel, and optionality intact."],
    ["YELLOW", "Top up supplies and stop pretending you will improvise flawlessly."],
    ["ORANGE", "Reduce exposure, tighten routes, and pre-position people or gear."],
    ["RED", "Move early, stay boring, and do not wait for consensus theatre."],
  ];

  return (
    <>
      <section className="mt-5 rounded-[28px] border border-white/10 bg-white/6 p-4 shadow-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">Decision ladder</h2>
            <p className="mt-1 text-sm text-slate-300">
              Snapshot refreshed at {formatDateTime(generatedAt)} with {totalEvidence} live items.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={exportData} className="bg-slate-100 text-slate-950 hover:bg-white">
              <SvgIcon name="Download" className="mr-2 h-4 w-4" /> Export notes
            </Button>
            <label className="inline-flex cursor-pointer items-center rounded-2xl bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-slate-700">
              <SvgIcon name="Upload" className="mr-2 h-4 w-4" /> Import notes
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
            <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/65 p-3">
              <p className="text-sm font-black">{label}</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <SelfTestsModal isOpen={showTests} onClose={() => setShowTests(false)} />
    </>
  );
}
