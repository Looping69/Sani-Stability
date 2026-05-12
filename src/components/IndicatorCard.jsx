import React from "react";
import { motion } from "framer-motion";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { Card, CardContent } from "@/components/ui/Card";

export function IndicatorCard({ item, isOpen, onToggle, onScoreChange }) {
  return (
    <Card className="border-white/10 bg-white/10 text-slate-100 shadow-xl">
      <CardContent className="p-4">
        <button
          onClick={onToggle}
          className="flex w-full items-start justify-between gap-3 text-left"
        >
          <div className="flex gap-3">
            <div className="rounded-2xl bg-slate-950 p-2">
              <SvgIcon name={item.icon} className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400">#{item.rank}</span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                  {item.category}
                </span>
              </div>
              <h3 className="mt-1 font-bold">{item.name}</h3>
            </div>
          </div>
          <SvgIcon
            name="ChevronDown"
            className={`h-5 w-5 transition ${isOpen ? "rotate-180" : ""}`}
          />
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
            onChange={(e) => onScoreChange(item.id, Number(e.target.value))}
            className="mt-2 w-full accent-slate-100"
          />
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 space-y-3 text-sm text-slate-300"
          >
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
}
