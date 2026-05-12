import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { useEvents } from "@/context/EventsProvider";

export function AddEventModal({ isOpen, onClose }) {
  const { addEvent } = useEvents();
  const [form, setForm] = useState({
    title: "",
    source: "",
    confidence: "Medium",
    note: "",
    tags: "",
  });

  function handleSubmit() {
    if (!form.title.trim()) return;
    addEvent(form);
    setForm({ title: "", source: "", confidence: "Medium", note: "", tags: "" });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add evidence">
      <div className="space-y-3">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Event title"
          className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            placeholder="Source"
            className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
          <select
            value={form.confidence}
            onChange={(e) => setForm({ ...form, confidence: e.target.value })}
            className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <textarea
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="Notes / verification details"
          rows={3}
          className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
        />
        <input
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="Tags: roads, fuel, politics..."
          className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
        />
        <Button
          onClick={handleSubmit}
          className="w-full bg-slate-100 text-slate-950 hover:bg-white"
        >
          <SvgIcon name="Plus" className="mr-2 h-4 w-4" /> Add evidence
        </Button>
      </div>
    </Modal>
  );
}
