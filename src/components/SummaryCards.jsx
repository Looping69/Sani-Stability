import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { useIndicators } from "@/context/IndicatorsProvider";
import { useChecklist } from "@/context/ChecklistProvider";
import { getRiskLabel } from "@/utils/helpers";

export function SummaryCards() {
  const { riskScore, clusters, totalEvidence } = useIndicators();
  const { readinessScore } = useChecklist();
  const risk = getRiskLabel(riskScore);

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <Card className="border-white/10 bg-white/8 text-slate-100 shadow-xl">
        <CardContent className="p-4">
          <p className="text-sm text-slate-300">Situation score</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <span className="text-4xl font-black">{riskScore}</span>
            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${risk.tone}`}>
              {risk.label}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-300">{risk.text}</p>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/8 text-slate-100 shadow-xl">
        <CardContent className="p-4">
          <p className="text-sm text-slate-300">Family readiness</p>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-4xl font-black">{readinessScore}%</span>
            <SvgIcon name="CheckCircle2" className="h-8 w-8 text-emerald-300" />
          </div>
          <p className="mt-2 text-sm text-slate-300">
            Target: 80% before the environment stops being polite.
          </p>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/8 text-slate-100 shadow-xl">
        <CardContent className="p-4">
          <p className="text-sm text-slate-300">Live evidence</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <span className="text-4xl font-black">{totalEvidence}</span>
            <SvgIcon name="TrendingUp" className="h-8 w-8 text-sky-300" />
          </div>
          <p className="mt-2 text-sm text-slate-300">
            {clusters.triggered
              ? `${clusters.highTierCount} elevated Tier 1 or Tier 2 signals are active.`
              : "No cluster trigger yet, but the feed is live and worth watching."}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
