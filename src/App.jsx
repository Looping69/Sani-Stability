import React from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SummaryCards } from "@/components/SummaryCards";
import { DecisionLadder } from "@/components/DecisionLadder";
import { IndicatorList } from "@/components/IndicatorList";
import { ReadinessChecklist } from "@/components/ReadinessChecklist";
import { EvidenceLog } from "@/components/EvidenceLog";
import { DashboardFooter } from "@/components/DashboardFooter";
import { LiveMap } from "@/components/LiveMap";
import { IndicatorsProvider } from "@/context/IndicatorsProvider";
import { ChecklistProvider } from "@/context/ChecklistProvider";
import { EventsProvider } from "@/context/EventsProvider";

function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_32rem),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.10),transparent_34rem)]" />

      <section className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
        <DashboardHeader />
        <SummaryCards />

        <section className="grid gap-5 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
          <aside className="flex flex-col gap-5 xl:sticky xl:top-5 xl:self-start">
            <DecisionLadder />
            <IndicatorList />
          </aside>

          <section className="grid gap-5">
            <LiveMap />

            <section className="grid gap-5 2xl:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]">
              <ReadinessChecklist />
              <EvidenceLog />
            </section>
          </section>
        </section>

        <DashboardFooter />
      </section>
    </main>
  );
}

export default function App() {
  return (
    <IndicatorsProvider>
      <ChecklistProvider>
        <EventsProvider>
          <Dashboard />
        </EventsProvider>
      </ChecklistProvider>
    </IndicatorsProvider>
  );
}
