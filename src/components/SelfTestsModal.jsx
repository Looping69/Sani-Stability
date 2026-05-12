import React, { useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { runSelfTests } from "@/utils/calculations";

export function SelfTestsModal({ isOpen, onClose }) {
  const tests = useMemo(() => runSelfTests(), []);
  const allPass = tests.every((t) => t.pass);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Self-tests — ${allPass ? "All Pass" : "FAILURES"}`}>
      <div className="space-y-2">
        {tests.map((test) => (
          <div key={test.name} className="flex items-center gap-2 text-xs text-slate-300">
            <SvgIcon
              name={test.pass ? "CheckCircle2" : "AlertTriangle"}
              className={`h-4 w-4 ${test.pass ? "text-emerald-400" : "text-red-400"}`}
            />
            <span>{test.name}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
