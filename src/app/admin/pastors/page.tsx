// src/app/admin/pastors/page.tsx
"use client";
import Table from "@/components/admin/Table";
import { getMockPastors } from "@/lib/admin/mock";


export default function PastorsPage() {
    const rows = getMockPastors();
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Pastors & Corpus</h2>
                <button className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Reindex All</button>
            </div>
            <Table
                headers={["Slug", "Name", "Sermons", "Embedded Chunks", "Last Updated", "Actions"]}
                rows={rows.map(p => [
                    p.slug,
                    p.name,
                    p.sermons,
                    p.embeddedChunks,
                    p.lastUpdated,
                    <div key={p.slug} className="flex gap-2 text-sm">
                        <button className="px-2 py-1 rounded border">Upload</button>
                        <button className="px-2 py-1 rounded border">Re-embed</button>
                        <button className="px-2 py-1 rounded border">Edit</button>
                    </div>
                ])}
            />
        </div>
    );
}