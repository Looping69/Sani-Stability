import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { DEFAULT_CHECKLIST } from "@/constants/checklist";
import { calculateReadinessScore } from "@/utils/calculations";

const STORAGE_KEY = "sani-checklist-v1";

const ChecklistContext = createContext(null);

function loadChecklist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function ChecklistProvider({ children }) {
  const [checklist, setChecklist] = useState(() => {
    return loadChecklist() || DEFAULT_CHECKLIST;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checklist));
    } catch {}
  }, [checklist]);

  function toggleItem(id) {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  }

  function setAllChecklist(newChecklist) {
    setChecklist(newChecklist);
  }

  const readinessScore = useMemo(() => calculateReadinessScore(checklist), [checklist]);

  const value = {
    checklist,
    readinessScore,
    toggleItem,
    setAllChecklist,
  };

  return <ChecklistContext.Provider value={value}>{children}</ChecklistContext.Provider>;
}

export function useChecklist() {
  const ctx = useContext(ChecklistContext);
  if (!ctx) throw new Error("useChecklist must be used within ChecklistProvider");
  return ctx;
}
