import React from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SummaryCards } from "@/components/SummaryCards";
import { DecisionLadder } from "@/components/DecisionLadder";
import { IndicatorList } from "@/components/IndicatorList";
import { ReadinessChecklist } from "@/components/ReadinessChecklist";
import { EvidenceLog } from "@/components/EvidenceLog";
import { DashboardFooter } from "@/components/DashboardFooter";
import { IndicatorsProvider } from "@/context/IndicatorsProvider";
import { ChecklistProvider } from "@/context/ChecklistProvider";
import { EventsProvider } from "@/context/EventsProvider";

function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
        <DashboardHeader />
        <SummaryCards />
        <DecisionLadder />
        <IndicatorList />

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <ReadinessChecklist />
          <EvidenceLog />
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
