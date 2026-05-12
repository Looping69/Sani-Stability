import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { useChecklist } from "@/context/ChecklistProvider";

export function ReadinessChecklist() {
  const { checklist, toggleItem } = useChecklist();

  return (
    <Card className="border-white/10 bg-white/10 text-slate-100 shadow-xl">
      <CardContent className="p-4">
        <h2 className="text-lg font-bold">Family readiness</h2>
        <p className="mt-1 text-sm text-slate-300">
          Personal resilience checklist. No bunker cosplay required.
        </p>
        <div className="mt-4 space-y-2">
          {checklist.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center gap-3 rounded-2xl bg-slate-950 p-3 text-left text-sm transition-colors hover:bg-slate-900"
            >
              <SvgIcon
                name={item.done ? "CheckCircle2" : "Circle"}
                className={`h-5 w-5 ${item.done ? "" : "text-slate-500"}`}
              />
              <span className={item.done ? "text-slate-300 line-through" : "text-slate-100"}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
