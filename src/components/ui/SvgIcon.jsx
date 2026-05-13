import React from "react";

export function SvgIcon({ name, className = "h-5 w-5" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const icons = {
    Activity: <svg {...common}><path d="M22 12h-4l-3 8L9 4l-3 8H2" /></svg>,
    AlertTriangle: <svg {...common}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>,
    CheckCircle2: <svg {...common}><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>,
    ChevronDown: <svg {...common}><path d="m6 9 6 6 6-6" /></svg>,
    Circle: <svg {...common}><circle cx="12" cy="12" r="9" /></svg>,
    Download: <svg {...common}><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>,
    ExternalLink: <svg {...common}><path d="M14 4h6v6" /><path d="M10 14 20 4" /><path d="M20 14v6H4V4h6" /></svg>,
    Fuel: <svg {...common}><path d="M4 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17" /><path d="M3 22h14" /><path d="M8 7h4" /><path d="M16 8h2l2 3v7a2 2 0 0 1-2 2h-1" /></svg>,
    Gauge: <svg {...common}><path d="M12 14l4-4" /><path d="M3.3 19a9 9 0 1 1 17.4 0" /></svg>,
    Home: <svg {...common}><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></svg>,
    Plus: <svg {...common}><path d="M12 5v14" /><path d="M5 12h14" /></svg>,
    Radio: <svg {...common}><path d="M4.9 19.1a10 10 0 0 1 0-14.2" /><path d="M7.8 16.2a6 6 0 0 1 0-8.5" /><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8a6 6 0 0 1 0 8.5" /><path d="M19.1 4.9a10 10 0 0 1 0 14.2" /></svg>,
    Route: <svg {...common}><circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" /><path d="M9 19h5a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h6" /></svg>,
    Search: <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>,
    Shield: <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>,
    Siren: <svg {...common}><path d="M7 18v-6a5 5 0 0 1 10 0v6" /><path d="M5 18h14" /><path d="M4 22h16" /><path d="M12 2v2" /><path d="M4.9 4.9l1.4 1.4" /><path d="M19.1 4.9l-1.4 1.4" /></svg>,
    Trash2: <svg {...common}><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>,
    TrendingUp: <svg {...common}><path d="M3 17 9 11l4 4 8-8" /><path d="M14 7h7v7" /></svg>,
    Upload: <svg {...common}><path d="M12 21V9" /><path d="m7 14 5-5 5 5" /><path d="M5 3h14" /></svg>,
    Users: <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9" /><path d="M16 3.1a4 4 0 0 1 0 7.8" /></svg>,
    X: <svg {...common}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>,
  };

  return icons[name] || icons.AlertTriangle;
}
