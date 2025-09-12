// src/components/admin/KpiCard.tsx
"use client";
import TrendSparkline from "./TrendSparkline";


export default function KpiCard({
label,
value,
diff,
series,
suffix,
}: {
label: string;
value: string | number;
diff?: number; // percent vs prior
series?: number[];
suffix?: string;
}) {
const up = (diff ?? 0) >= 0;
return (
<div className="bg-white rounded-xl border p-4">
<div className="text-sm text-gray-500">{label}</div>
<div className="mt-1 flex items-end justify-between">
<div>
<div className="text-2xl font-semibold">{value}{suffix || ""}</div>
{typeof diff === "number" && (
<div className={`text-xs mt-1 ${up ? "text-emerald-600" : "text-rose-600"}`}>
{up ? "▲" : "▼"} {Math.abs(diff)}%
</div>
)}
</div>
{series && series.length > 1 && (
<div className="w-28 h-10">
<TrendSparkline data={series} />
</div>
)}
</div>
</div>
);
}