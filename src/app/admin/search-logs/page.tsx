// src/app/admin/search-logs/page.tsx
"use client";
import Table from "@/components/admin/Table";
import { getMockSearchLogs } from "@/lib/admin/mock";


export default function SearchLogsPage() {
    const logs = getMockSearchLogs();
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Search Logs</h2>
                <button className="px-3 py-1.5 text-sm rounded-md border">Export CSV</button>
            </div>
            <Table
                headers={["Time", "Query", "Top Pastor", "Score"]}
                rows={logs.map(l => [
                    new Date(l.ts).toLocaleString(),
                    <span key={l.ts} className="line-clamp-2 max-w-[520px]">{l.query}</span>,
                    l.topPastor,
                    l.topScore.toFixed(2),
                ])}
            />
        </div>
    );
}