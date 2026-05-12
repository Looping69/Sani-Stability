import { DEFAULT_INDICATORS } from "@/constants/indicators";
import { DEFAULT_CHECKLIST } from "@/constants/checklist";

export function calculateRiskScore(indicators) {
  const totalWeight = indicators.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) return 0;
  const weighted = indicators.reduce((sum, item) => sum + item.score * item.weight, 0);
  return Math.round((weighted / (totalWeight * 5)) * 100);
}

export function calculateReadinessScore(checklist) {
  if (!checklist.length) return 0;
  const done = checklist.filter((item) => item.done).length;
  return Math.round((done / checklist.length) * 100);
}

export function detectClusters(indicators) {
  const highTier = indicators.filter((item) => ["Tier 1", "Tier 2"].includes(item.category) && item.score >= 3);
  const criticalTierOne = indicators.filter((item) => item.category === "Tier 1" && item.score >= 4);
  return {
    highTierCount: highTier.length,
    criticalTierOneCount: criticalTierOne.length,
    triggered: highTier.length >= 3 || criticalTierOne.length >= 2,
  };
}

export function runSelfTests() {
  const allZeroRisk = calculateRiskScore(DEFAULT_INDICATORS) === 0;
  const allMaxRisk = calculateRiskScore(DEFAULT_INDICATORS.map((item) => ({ ...item, score: 5 }))) === 100;
  const halfReadiness = calculateReadinessScore(DEFAULT_CHECKLIST.map((item, index) => ({ ...item, done: index < DEFAULT_CHECKLIST.length / 2 }))) === 50;
  const clusterByHighTier = detectClusters(DEFAULT_INDICATORS.map((item, index) => ({ ...item, score: index < 3 ? 3 : 0 }))).triggered === true;
  const clusterByCriticalTierOne = detectClusters(DEFAULT_INDICATORS.map((item, index) => ({ ...item, score: index < 2 ? 4 : 0 }))).triggered === true;
  const noCluster = detectClusters(DEFAULT_INDICATORS).triggered === false;

  return [
    { name: "Risk is 0 when all indicators are 0", pass: allZeroRisk },
    { name: "Risk is 100 when all indicators are 5", pass: allMaxRisk },
    { name: "Readiness is 50% when half checklist is done", pass: halfReadiness },
    { name: "Cluster triggers when 3 high Tier 1/2 signals exist", pass: clusterByHighTier },
    { name: "Cluster triggers when 2 critical Tier 1 signals exist", pass: clusterByCriticalTierOne },
    { name: "Cluster stays false with no elevated signals", pass: noCluster },
  ];
}
