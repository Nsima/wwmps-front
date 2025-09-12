// src/app/admin/page.tsx
"use client";
import KpiCard from "@/components/admin/KpiCard";
import Table from "@/components/admin/Table";
import StatusPill from "@/components/admin/StatusPill";
import { getMockMetrics, getMockConversations } from "@/lib/admin/mock";


export default function AdminDashboardPage() {
    const metrics = getMockMetrics();
    const conv = getMockConversations().slice(0, 5);

    return (
        <div className="space-y-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Total Users" value={metrics.totals.users} diff={5} series={metrics.trends.dailyUsers} />
                <KpiCard label="Conversations" value={metrics.totals.conversations} diff={8} series={metrics.trends.dailyQuestions} />
                <KpiCard label="Today’s Questions" value={metrics.totals.questionsToday} diff={2} series={metrics.trends.dailyQuestions} />
                <KpiCard label="Avg Latency" value={(metrics.totals.avgLatencyMs/1000).toFixed(1)} suffix="s" diff={-9} series={metrics.trends.latencyMs} />
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-3">
                    <h2 className="text-sm font-semibold text-gray-600">Recent Conversations</h2>
                    <Table
                        headers={["When", "User", "Pastor", "Question", "Tokens", "Latency", "Src", "Feedback"]}
                        rows={conv.map(c => [
                            new Date(c.ts).toLocaleString(),
                            c.user,
                            c.pastor,
                            <span key={c.id} className="line-clamp-2 max-w-[380px]">{c.question}</span>,
                            c.answerTokens,
                            `${(c.latencyMs/1000).toFixed(1)}s`,
                            c.sources,
                            c.feedback ? (c.feedback === "up" ? "👍" : "👎") : "—",
                        ])}
                    />
                </div>
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-gray-600">System Health</h2>
                    <div className="bg-white border rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span>Search service</span>
                            <StatusPill ok={metrics.system.search_service} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span>LLM provider</span>
                            <span className="text-sm text-gray-600">{metrics.system.llm_provider}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Model</span>
                            <span className="text-sm text-gray-600">{metrics.system.model}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Generation</span>
                            <StatusPill ok={metrics.system.llm_ok} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}