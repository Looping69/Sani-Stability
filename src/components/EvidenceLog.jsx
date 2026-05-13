import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { useEvents } from "@/context/EventsProvider";
import { useIndicators } from "@/context/IndicatorsProvider";
import { AddEventModal } from "./AddEventModal";
import { flattenEvidence, formatDateTime } from "@/utils/helpers";

export function EvidenceLog() {
  const { events, deleteEvent } = useEvents();
  const { indicators } = useIndicators();
  const [showModal, setShowModal] = useState(false);

  const liveEvidence = useMemo(() => flattenEvidence(indicators), [indicators]);

  return (
    <>
      <Card className="border-white/10 bg-white/8 text-slate-100 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Evidence log</h2>
              <p className="mt-1 text-sm text-slate-300">
                Live items come from the snapshot. Local notes are for your own verification trail.
              </p>
            </div>
            <Button onClick={() => setShowModal(true)} className="bg-slate-100 text-slate-950 hover:bg-white">
              <SvgIcon name="Plus" className="mr-2 h-4 w-4" /> Add note
            </Button>
          </div>

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Live signal feed
              </h3>
              <span className="text-xs text-slate-500">{liveEvidence.length} items</span>
            </div>
            <div className="space-y-3">
              {liveEvidence.slice(0, 8).map((event) => (
                <a
                  key={event.id}
                  href={event.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-white/8 bg-slate-950/75 p-3 transition-colors hover:border-sky-300/45 hover:bg-slate-950"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        {event.indicatorName}
                      </p>
                      <h3 className="mt-1 font-semibold text-slate-100">{event.title}</h3>
                      <p className="mt-2 text-xs text-slate-400">
                        {event.publisher} • {formatDateTime(event.publishedAt)}
                      </p>
                    </div>
                    <SvgIcon name="ExternalLink" className="h-4 w-4 text-slate-500" />
                  </div>
                  {event.note ? (
                    <p className="mt-2 text-sm leading-6 text-slate-300">{event.note}</p>
                  ) : null}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Local notes
              </h3>
              <span className="text-xs text-slate-500">{events.length} notes</span>
            </div>
            <div className="space-y-3">
              {events.length ? (
                events.map((event) => (
                  <div key={event.id} className="rounded-2xl border border-white/8 bg-slate-950/75 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-500">
                          {event.date} • {event.confidence} confidence
                        </p>
                        <h3 className="mt-1 font-semibold text-slate-100">{event.title}</h3>
                        <p className="mt-1 text-xs text-slate-400">Source: {event.source}</p>
                      </div>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <SvgIcon name="Trash2" className="h-4 w-4" />
                      </button>
                    </div>
                    {event.note ? <p className="mt-2 text-sm text-slate-300">{event.note}</p> : null}
                    {event.tags ? <p className="mt-2 text-xs text-slate-500">Tags: {event.tags}</p> : null}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/45 p-4 text-sm text-slate-400">
                  No manual notes yet. Add one when you verify something locally, call a contact, or
                  decide a source deserves more trust than a headline alone.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AddEventModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
