import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { DEFAULT_INDICATORS } from "@/constants/indicators";
import { clamp } from "@/utils/helpers";
import { calculateRiskScore, detectClusters } from "@/utils/calculations";

const STORAGE_KEY = "sani-indicators-v1";

const IndicatorsContext = createContext(null);

function loadIndicators() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function IndicatorsProvider({ children }) {
  const [indicators, setIndicators] = useState(() => {
    return loadIndicators() || DEFAULT_INDICATORS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(indicators));
    } catch {}
  }, [indicators]);

  function updateIndicator(id, value) {
    setIndicators((prev) =>
      prev.map((item) => (item.id === id ? { ...item, score: clamp(value, 0, 5) } : item))
    );
  }

  function setAllIndicators(newIndicators) {
    setIndicators(newIndicators);
  }

  const riskScore = useMemo(() => calculateRiskScore(indicators), [indicators]);
  const clusters = useMemo(() => detectClusters(indicators), [indicators]);

  const value = {
    indicators,
    riskScore,
    clusters,
    updateIndicator,
    setAllIndicators,
  };

  return <IndicatorsContext.Provider value={value}>{children}</IndicatorsContext.Provider>;
}

export function useIndicators() {
  const ctx = useContext(IndicatorsContext);
  if (!ctx) throw new Error("useIndicators must be used within IndicatorsProvider");
  return ctx;
}
