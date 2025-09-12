// src/components/admin/TrendSparkline.tsx
"use client";
export default function TrendSparkline({ data }: { data: number[] }) {
if (!data || data.length === 0) return null;
const w = 112, h = 40, p = 2;
const max = Math.max(...data);
const min = Math.min(...data);
const scaleX = (i: number) => p + (i * (w - p * 2)) / (data.length - 1);
const scaleY = (v: number) => {
if (max === min) return h / 2;
return h - p - ((v - min) * (h - p * 2)) / (max - min);
};
const d = data.map((v, i) => `${i === 0 ? "M" : "L"}${scaleX(i)},${scaleY(v)}`).join(" ");
return (
<svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
<path d={d} fill="none" stroke="currentColor" strokeWidth="2" />
</svg>
);
}