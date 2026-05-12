import React from "react";
import { motion } from "framer-motion";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { Card, CardContent } from "@/components/ui/Card";
import { SOURCE_CATALOG } from "@/constants/sourceCatalog";
import { formatDateTime, getSignalLabel } from "@/utils/helpers";

function SourceChip({ sourceId }) {
  const source = SOURCE_CATALOG[sourceId];
  if (!source) return null;

  return (
    <a
      href={source.href}
      target="_blank"
      rel="noreferrer"
      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 transition-colors hover:border-sky-300/60 hover:text-sky-100"
    >
      {source.label}
    </a>
  );
}

export function IndicatorCard({ item, isOpen, onToggle }) {
  const score = getSignalLabel(item.score);

  return (
    <Card className="border-white/10 bg-white/8 text-slate-100 shadow-xl">
      <CardContent className="p-4">
        <button onClick={onToggle} className="flex w-full items-start justify-between gap-3 text-left">
          <div className="flex gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/75 p-2">
              <SvgIcon name={item.icon} className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400">#{item.rank}</span>
                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs text-slate-300">
                  {item.category}
                </span>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${score.tone}`}>
                  {score.label}
                </span>
              </div>
              <h3 className="mt-1 font-bold">{item.name}</h3>
              <p className="mt-1 text-sm text-slate-300">{item.summary}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/75 px-3 py-2 text-right">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Score</p>
              <p className="text-lg font-black">{item.score}/5</p>
            </div>
            <SvgIcon
              name="ChevronDown"
              className={`h-5 w-5 transition ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span>{item.evidence.length} linked items</span>
          <span className="text-slate-600">•</span>
          <span>Updated {formatDateTime(item.updatedAt)}</span>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 space-y-3 text-sm text-slate-300"
          >
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-slate-950/75 p-3">
                <p className="font-semibold text-slate-100">Why it matters</p>
                <p className="mt-1 leading-6">{item.why}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/75 p-3">
                <p className="font-semibold text-slate-100">What to watch</p>
                <p className="mt-1 leading-6">{item.watch}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-slate-950/75 p-3">
              <p className="font-semibold text-slate-100">Tracked sources</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.sourceIds.length ? (
                  item.sourceIds.map((sourceId) => <SourceChip key={sourceId} sourceId={sourceId} />)
                ) : (
                  <p className="text-slate-400">This indicator is driven locally, not by public feeds.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-slate-950/75 p-3">
              <p className="font-semibold text-slate-100">Latest evidence</p>
              <div className="mt-3 space-y-3">
                {item.evidence.length ? (
                  item.evidence.map((evidence) => (
                    <a
                      key={`${evidence.url}-${evidence.title}`}
                      href={evidence.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl border border-white/8 bg-white/4 p-3 transition-colors hover:border-sky-300/45 hover:bg-white/7"
                    >
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        {evidence.publisher} • {formatDateTime(evidence.publishedAt)}
                      </p>
                      <p className="mt-1 font-medium text-slate-100">{evidence.title}</p>
                      {evidence.note ? (
                        <p className="mt-2 text-sm leading-6 text-slate-300">{evidence.note}</p>
                      ) : null}
                    </a>
                  ))
                ) : (
                  <p className="text-slate-400">
                    No linked evidence landed in the current snapshot for this indicator.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
