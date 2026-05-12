import React from "react";

export function Button({ className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
