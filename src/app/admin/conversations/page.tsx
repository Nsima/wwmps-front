// src/app/admin/conversations/page.tsx
"use client";
import Table from "@/components/admin/Table";
import { getMockConversations } from "@/lib/admin/mock";


export default function ConversationsPage() {
    const rows = getMockConversations();
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold">All Conversations</h2>
                    <div className="text-sm text-gray-500">{rows.length} items</div>
                </div>
                <Table
                    headers={["Time", "User", "Pastor", "Question", "Latency", "Tokens", "Sources", "Feedback"]}
                    rows={rows.map(r => [
                        new Date(r.ts).toLocaleString(),
                        r.user,
                        r.pastor,
                        <span key={r.id} className="line-clamp-2 max-w-[520px]">{r.question}</span>,
                        `${(r.latencyMs/1000).toFixed(1)}s`,
                        r.answerTokens,
                        r.sources,
                        r.feedback ? (r.feedback === "up" ? "👍" : "👎") : "—",
                    ])}
                />
            </div>
        );
}