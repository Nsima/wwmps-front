// src/app/admin/settings/page.tsx
"use client";
export default function SettingsPage() {
    return (
    <form className="max-w-2xl space-y-6">
        <section className="bg-white border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold">RAG Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="text-sm">
                    <div className="text-gray-600">Top K</div>
                    <input type="number" defaultValue={3} min={1} max={10} className="mt-1 w-full border rounded-md px-3 py-2" />
                </label>
                <label className="text-sm">
                    <div className="text-gray-600">Max Context Tokens</div>
                    <input type="number" defaultValue={4096} min={512} max={32000} className="mt-1 w-full border rounded-md px-3 py-2" />
                </label>
            </div>
            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="rounded" />
                Enable streaming (SSE)
            </label>
        </section>
        <section className="bg-white border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold">Safety & Moderation</h3>
            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="rounded" />
                Block medical/legal instructions
            </label>
            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="rounded" />
                Show source citations by default
            </label>
        </section>
        <div className="flex gap-2">
            <button type="button" className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Save</button>
            <button type="button" className="px-3 py-1.5 text-sm rounded-md border">Reset</button>
        </div>
    </form>
    );
}