import React, { useState } from "react";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { IndicatorCard } from "./IndicatorCard";
import { useIndicators } from "@/context/IndicatorsProvider";

export function IndicatorList() {
  const { indicators } = useIndicators();
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(indicators[0]?.id || null);

  const filtered = indicators.filter((item) =>
    `${item.name} ${item.category} ${item.watch} ${item.why} ${item.summary}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <section className="mt-5">
      <div className="mb-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-3 py-2">
        <SvgIcon name="Search" className="h-4 w-4 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search indicators or summaries..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
        />
      </div>

      <div className="grid gap-3">
        {filtered.map((item) => (
          <IndicatorCard
            key={item.id}
            item={item}
            isOpen={expandedId === item.id}
            onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
          />
        ))}
      </div>
    </section>
  );
}
