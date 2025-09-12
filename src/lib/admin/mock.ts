// src/lib/admin/mock.ts
import type { AdminMetrics, ConversationRow, PastorRow, UserRow, SearchLogRow } from "./types";

export function getMockMetrics(): AdminMetrics {
    return {
        totals: {
            users: 1240,
            conversations: 5860,
            questionsToday: 213,
            avgLatencyMs: 1240,
        },
        trends: {
            dailyQuestions: [120, 150, 170, 160, 190, 210, 205],
            dailyUsers: [30, 32, 35, 34, 36, 41, 38],
            latencyMs: [1600, 1500, 1400, 1300, 1250, 1280, 1240],
        },
        system: {
            search_service: true,
            llm_ok: true,
            model: "gpt-4o-mini",
            llm_provider: "openai",
        },
    };
}

export function getMockConversations(): ConversationRow[] {
    return Array.from({ length: 10 }).map((_, i) => ({
        id: `conv_${i + 1}`,
        ts: new Date(Date.now() - i * 3600_000).toISOString(),
        user: `user${i + 1}@example.com`,
        pastor: ["Oyedepo", "Adeboye", "Adefarasin", "Ibiyeomie"][i % 4],
        question: "What does the Bible say about forgiveness in difficult times?",
        answerTokens: 420 + i * 7,
        latencyMs: 900 + i * 50,
        sources: (i % 3) + 1,
        feedback: i % 5 === 0 ? "up" : i % 7 === 0 ? "down" : null,
    }));
}

export function getMockPastors(): PastorRow[] {
    return [
        { slug: "oyedepo", name: "Bishop David Oyedepo", sermons: 22, embeddedChunks: 540, lastUpdated: "2025-08-20" },
        { slug: "adeboye", name: "Pastor Enoch Adeboye", sermons: 14, embeddedChunks: 420, lastUpdated: "2025-08-18" },
        { slug: "adefarasin", name: "Pastor Paul Adefarasin", sermons: 10, embeddedChunks: 310, lastUpdated: "2025-08-17" },
        { slug: "ibiyeomie", name: "Pastor David Ibiyeomie", sermons: 8, embeddedChunks: 260, lastUpdated: "2025-08-15" },
    ];
}

export function getMockUsers(): UserRow[] {
    return Array.from({ length: 12 }).map((_, i) => ({
        id: `u_${i + 1}`,
        email: `person${i + 1}@mail.com`,
        lastActive: new Date(Date.now() - i * 86_400_000).toISOString(),
        questions: 3 + (i % 6),
    }));
}

export function getMockSearchLogs(): SearchLogRow[] {
    return Array.from({ length: 20 }).map((_, i) => ({
        ts: new Date(Date.now() - i * 15 * 60_000).toISOString(),
        query: ["faith", "prayer", "tithing", "forgiveness", "purpose"][i % 5] + " guidance",
        topPastor: ["oyedepo", "adeboye", "adefarasin", "ibiyeomie"][i % 4],
        topScore: 0.62 + (i % 7) * 0.03,
    }));
}