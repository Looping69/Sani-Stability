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

export function getRiskLabel(value) {
  if (value >= 75) return { label: "RED", text: "Move early / avoid exposure", tone: "bg-red-100 text-red-800 border-red-200" };
  if (value >= 55) return { label: "ORANGE", text: "Pre-position and reduce travel", tone: "bg-orange-100 text-orange-800 border-orange-200" };
  if (value >= 30) return { label: "YELLOW", text: "Prepare and verify", tone: "bg-yellow-100 text-yellow-800 border-yellow-200" };
  return { label: "GREEN", text: "Monitor calmly", tone: "bg-emerald-100 text-emerald-800 border-emerald-200" };
}
