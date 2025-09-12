// src/lib/admin/types.ts
export type MetricPoint = { ts: string; value: number };


export type AdminMetrics = {
totals: {
users: number;
conversations: number;
questionsToday: number;
avgLatencyMs: number; // p50
};
trends: {
dailyQuestions: number[];
dailyUsers: number[];
latencyMs: number[]; // p50 daily
};
system: {
search_service: boolean;
llm_ok: boolean;
model: string;
llm_provider: string;
};
};


export type ConversationRow = {
id: string;
ts: string; // ISO
user: string;
pastor: string;
question: string;
answerTokens: number;
latencyMs: number;
sources: number;
feedback?: "up" | "down" | null;
};


export type PastorRow = {
slug: string;
name: string;
sermons: number;
embeddedChunks: number;
lastUpdated: string;
};


export type UserRow = {
id: string;
email: string;
lastActive: string;
questions: number;
};


export type SearchLogRow = {
ts: string;
query: string;
topPastor: string;
topScore: number;
};