// src/components/admin/StatusPill.tsx
"use client";
export default function StatusPill({ ok, label }: { ok: boolean; label?: string }) {
return (
<span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border
${ok ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-rose-700 bg-rose-50 border-rose-200"}`}>
<span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-emerald-500" : "bg-rose-500"}`} />
{label ?? (ok ? "Healthy" : "Issue")}
</span>
);
}