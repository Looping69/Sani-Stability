import React from "react";
import { motion } from "framer-motion";
import { SvgIcon } from "@/components/ui/SvgIcon";

export function DashboardHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-5 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            S.A.N.I Stability Intelligence
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-4xl">
            Mobile Risk Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            A calm, evidence-first dashboard for turning messy signals into clear family decisions.
          </p>
        </div>
        <SvgIcon name="Gauge" className="mt-1 h-8 w-8 text-slate-300" />
      </div>
    </motion.header>
  );
}
