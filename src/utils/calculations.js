import { DEFAULT_CHECKLIST } from "@/constants/checklist";
import { DEFAULT_INDICATORS } from "@/constants/indicators";

export function calculateRiskScore(indicators) {
  const filtered = indicators.filter((item) => item.id !== "family-readiness");
  const totalWeight = filtered.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) return 0;

  const weighted = filtered.reduce((sum, item) => sum + item.score * item.weight, 0);
  return Math.round((weighted / (totalWeight * 5)) * 100);
}

export function calculateReadinessScore(checklist) {
  if (!checklist.length) return 0;
  const done = checklist.filter((item) => item.done).length;
  return Math.round((done / checklist.length) * 100);
}

export function detectClusters(indicators) {
  const elevatedTier = indicators.filter(
    (item) => ["Tier 1", "Tier 2"].includes(item.category) && item.score >= 3
  );
  const criticalTierOne = indicators.filter(
    (item) => item.category === "Tier 1" && item.score >= 4
  );

  return {
    highTierCount: elevatedTier.length,
    criticalTierOneCount: criticalTierOne.length,
    triggered: elevatedTier.length >= 3 || criticalTierOne.length >= 2,
  };
}

export function runSelfTests() {
  const externalIndicators = DEFAULT_INDICATORS.filter((item) => item.id !== "family-readiness");
  const allZeroRisk =
    calculateRiskScore(externalIndicators.map((item) => ({ ...item, score: 0 }))) === 0;
  const allMaxRisk =
    calculateRiskScore(externalIndicators.map((item) => ({ ...item, score: 5 }))) === 100;
  const halfReadiness =
    calculateReadinessScore(
      DEFAULT_CHECKLIST.map((item, index) => ({
        ...item,
        done: index < DEFAULT_CHECKLIST.length / 2,
      }))
    ) === 50;
  const clusterByHighTier =
    detectClusters(
      externalIndicators.map((item, index) => ({ ...item, score: index < 3 ? 3 : 0 }))
    ).triggered === true;
  const clusterByCriticalTierOne =
    detectClusters(
      externalIndicators.map((item, index) => ({
        ...item,
        score: index < 2 ? 4 : 0,
      }))
    ).triggered === true;
  const noCluster = detectClusters(externalIndicators.map((item) => ({ ...item, score: 0 }))).triggered === false;

  return [
    { name: "Risk is 0 when all tracked indicators are quiet", pass: allZeroRisk },
    { name: "Risk is 100 when all tracked indicators are maxed", pass: allMaxRisk },
    { name: "Readiness is 50% when half the checklist is done", pass: halfReadiness },
    { name: "Cluster triggers with 3 elevated Tier 1 or Tier 2 signals", pass: clusterByHighTier },
    { name: "Cluster triggers with 2 critical Tier 1 signals", pass: clusterByCriticalTierOne },
    { name: "Cluster stays false with no elevated signals", pass: noCluster },
  ];
}
