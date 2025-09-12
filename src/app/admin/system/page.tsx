// src/app/admin/system/page.tsx
"use client";
import StatusPill from "@/components/admin/StatusPill";
import { getMockMetrics } from "@/lib/admin/mock";


export default function SystemPage() {
    const metrics = getMockMetrics();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border rounded-xl p-4 space-y-3">
                <h3 className="font-semibold">Services</h3>
                <div className="flex items-center justify-between"><span>Search Service</span><StatusPill ok={metrics.system.search_service} /></div>
                <div className="flex items-center justify-between"><span>LLM Generation</span><StatusPill ok={metrics.system.llm_ok} /></div>
                <div className="text-sm text-gray-600">Provider: {metrics.system.llm_provider}</div>
                <div className="text-sm text-gray-600">Model: {metrics.system.model}</div>
            </div>
            <div className="bg-white border rounded-xl p-4 space-y-3">
                <h3 className="font-semibold">Cache & Embeddings</h3>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-sm rounded-md border">Warm Cache</button>
                    <button className="px-3 py-1.5 text-sm rounded-md border">Clear Cache</button>
                    <button className="px-3 py-1.5 text-sm rounded-md border">Rebuild Index</button>
                </div>
                <p className="text-sm text-gray-600">Wire these buttons to your backend admin endpoints.</p>
            </div>
        </div>
    );
}