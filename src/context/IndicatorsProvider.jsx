import React, { createContext, useContext, useMemo } from "react";
import { DEFAULT_INDICATORS } from "@/constants/indicators";
import { calculateRiskScore, detectClusters } from "@/utils/calculations";
import liveSignals from "@/data/liveSignals.json";

const IndicatorsContext = createContext(null);

function buildIndicators() {
  return DEFAULT_INDICATORS.map((item) => {
    if (item.id === "family-readiness") {
      return {
        ...item,
        score: 0,
        summary: "Derived from your readiness checklist rather than public reporting.",
        evidence: [],
        updatedAt: liveSignals.generatedAt,
      };
    }

    const live = liveSignals.indicators?.[item.id] || {};
    return {
      ...item,
      score: Number.isFinite(live.score) ? live.score : 0,
      summary: live.summary || "No current evidence loaded for this indicator.",
      evidence: Array.isArray(live.evidence) ? live.evidence : [],
      sourceIds: Array.isArray(live.sourceIds) && live.sourceIds.length ? live.sourceIds : item.sourceIds,
      updatedAt: live.updatedAt || liveSignals.generatedAt,
    };
  });
}

export function IndicatorsProvider({ children }) {
  const indicators = useMemo(() => buildIndicators(), []);
  const riskScore = useMemo(() => calculateRiskScore(indicators), [indicators]);
  const clusters = useMemo(() => detectClusters(indicators), [indicators]);
  const totalEvidence = useMemo(
    () => indicators.reduce((sum, item) => sum + item.evidence.length, 0),
    [indicators]
  );

  return (
    <IndicatorsContext.Provider
      value={{
        indicators,
        riskScore,
        clusters,
        totalEvidence,
        generatedAt: liveSignals.generatedAt,
        feedStatus: liveSignals.feedStatus,
        feedMode: liveSignals.feedMode,
      }}
    >
      {children}
    </IndicatorsContext.Provider>
  );
}

export function useIndicators() {
  const ctx = useContext(IndicatorsContext);
  if (!ctx) throw new Error("useIndicators must be used within IndicatorsProvider");
  return ctx;
}
