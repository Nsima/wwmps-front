// src/components/admin/Table.tsx
"use client";
export default function Table({
headers,
rows,
}: {
headers: (string | React.ReactNode)[];
rows: (React.ReactNode[])[];
}) {
return (
<div className="overflow-auto border rounded-xl bg-white">
<table className="min-w-full text-sm">
<thead className="bg-gray-50 text-gray-600">
<tr>
{headers.map((h, i) => (
<th key={i} className="text-left font-medium px-3 py-2">{h}</th>
))}
</tr>
</thead>
<tbody>
{rows.map((r, i) => (
<tr key={i} className={i % 2 ? "bg-white" : "bg-gray-50/30"}>
{r.map((c, j) => (
<td key={j} className="px-3 py-2 align-top">{c}</td>
))}
</tr>
))}
</tbody>
</table>
</div>
);
}