import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { useEvents } from "@/context/EventsProvider";
import { AddEventModal } from "./AddEventModal";

export function EvidenceLog() {
  const { events, deleteEvent } = useEvents();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className="border-white/10 bg-white/10 text-slate-100 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Evidence log</h2>
              <p className="mt-1 text-sm text-slate-300">
                Add only verified or clearly labelled claims. Radical concept, apparently.
              </p>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="bg-slate-100 text-slate-950 hover:bg-white"
            >
              <SvgIcon name="Plus" className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {events.map((event) => (
              <div key={event.id} className="rounded-2xl bg-slate-950 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">
                      {event.date} · {event.confidence} confidence
                    </p>
                    <h3 className="mt-1 font-bold">{event.title}</h3>
                    <p className="mt-1 text-xs text-slate-400">Source: {event.source}</p>
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <SvgIcon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>
                {event.note && <p className="mt-2 text-sm text-slate-300">{event.note}</p>}
                {event.tags && <p className="mt-2 text-xs text-slate-500">Tags: {event.tags}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddEventModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
