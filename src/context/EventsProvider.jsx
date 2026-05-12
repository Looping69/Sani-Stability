import React, { createContext, useContext, useEffect, useState } from "react";
import { safeRandomId, todayStamp } from "@/utils/helpers";

const STORAGE_KEY = "sani-events-v1";

const EventsContext = createContext(null);

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const SEED_EVENT = {
  id: "seed-event",
  date: todayStamp(),
  title: "Dashboard created",
  source: "Manual",
  confidence: "Medium",
  note: "Initial mobile-first MVP. Replace with verified events as evidence comes in.",
  tags: "setup",
};

export function EventsProvider({ children }) {
  const [events, setEvents] = useState(() => {
    return loadEvents() || [SEED_EVENT];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {}
  }, [events]);

  function addEvent({ title, source, confidence, note, tags }) {
    if (!title.trim()) return;
    setEvents((prev) => [
      {
        id: safeRandomId(),
        date: todayStamp(),
        title: title.trim(),
        source: source.trim() || "Manual",
        confidence,
        note: note.trim(),
        tags: tags.trim(),
      },
      ...prev,
    ]);
  }

  function deleteEvent(id) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function setAllEvents(newEvents) {
    setEvents(newEvents);
  }

  const value = { events, addEvent, deleteEvent, setAllEvents };

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
}
