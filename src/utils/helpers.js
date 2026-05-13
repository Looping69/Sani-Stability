export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function safeRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDateTime(value) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function getRiskLabel(value) {
  if (value >= 75) {
    return {
      label: "RED",
      text: "Move early and reduce exposure now.",
      tone: "border-red-300 bg-red-100 text-red-800",
    };
  }
  if (value >= 55) {
    return {
      label: "ORANGE",
      text: "Pre-position supplies and tighten movement decisions.",
      tone: "border-orange-300 bg-orange-100 text-orange-800",
    };
  }
  if (value >= 30) {
    return {
      label: "YELLOW",
      text: "Prepare, verify, and keep optionality open.",
      tone: "border-yellow-300 bg-yellow-100 text-yellow-800",
    };
  }
  return {
    label: "GREEN",
    text: "Monitor calmly and avoid noise-driven reactions.",
    tone: "border-emerald-300 bg-emerald-100 text-emerald-800",
  };
}

export function getSignalLabel(score) {
  if (score >= 5) {
    return { label: "Critical", tone: "border-red-400 bg-red-500/15 text-red-200" };
  }
  if (score >= 4) {
    return { label: "High", tone: "border-orange-400 bg-orange-500/15 text-orange-200" };
  }
  if (score >= 3) {
    return { label: "Elevated", tone: "border-yellow-400 bg-yellow-500/15 text-yellow-200" };
  }
  if (score >= 2) {
    return { label: "Active", tone: "border-sky-400 bg-sky-500/15 text-sky-200" };
  }
  if (score >= 1) {
    return { label: "Low", tone: "border-slate-400 bg-slate-500/15 text-slate-200" };
  }
  return { label: "Quiet", tone: "border-emerald-400 bg-emerald-500/15 text-emerald-200" };
}

export function flattenEvidence(indicators) {
  return indicators
    .flatMap((item) =>
      item.evidence.map((evidence, index) => ({
        ...evidence,
        id: `${item.id}-${index}-${evidence.url}`,
        indicatorId: item.id,
        indicatorName: item.name,
      }))
    )
    .sort((left, right) => {
      const leftTime = left.publishedAt ? new Date(left.publishedAt).getTime() : 0;
      const rightTime = right.publishedAt ? new Date(right.publishedAt).getTime() : 0;
      return rightTime - leftTime;
    });
}
