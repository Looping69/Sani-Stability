import React from "react";
import { motion } from "framer-motion";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { useIndicators } from "@/context/IndicatorsProvider";
import { formatDateTime } from "@/utils/helpers";

export function DashboardHeader() {
  const { generatedAt, feedMode } = useIndicators();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-5 overflow-hidden rounded-[28px] border border-white/10 bg-white/6 shadow-2xl backdrop-blur"
    >
      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-sky-200/70">
            S.A.N.I Stability Intelligence
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
            Live household signal dashboard for messy South African risk conditions
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            The interface stays calm. The evidence does the talking. Signals come from a
            refreshable snapshot built on public reporting and official statements, rather than
            thumb-on-the-scale vibes.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/55 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-100">Snapshot status</p>
            <SvgIcon name="Gauge" className="h-5 w-5 text-sky-200" />
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Last refresh</p>
              <p className="mt-1 font-medium text-slate-100">{formatDateTime(generatedAt)}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Feed mode</p>
              <p className="mt-1 font-medium capitalize text-slate-100">
                {feedMode.replaceAll("-", " ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
