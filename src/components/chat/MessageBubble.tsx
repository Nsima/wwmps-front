// src/components/chat/MessageBubble.tsx
"use client";
import type { Msg } from "@/lib/types";
import Sources from "./Sources";

export default function MessageBubble({ m }: { m: Msg }) {
  return (
    <div className={`mb-4 flex ${m.isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-3/4 rounded-lg p-4 ${
          m.isUser
            ? "bg-indigo-600 text-white rounded-br-none"
            : "bg-white border border-gray-200 shadow-sm rounded-bl-none"
        }`}
      >
        {!m.isUser && m.pastorName && (
          <div className="font-medium text-indigo-700 mb-1">{m.pastorName}</div>
        )}
        <p className={m.isUser ? "text-white" : "text-gray-700"}>{m.text}</p>
        {!m.isUser && m.sources?.length ? <Sources sources={m.sources} /> : null}
      </div>
    </div>
  );
}
