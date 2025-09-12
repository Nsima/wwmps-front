"use client";
import type { Msg } from "@/lib/types";
import MessageBubble from "./MessageBubble";

export default function MessageList({
  messages,
  isTyping,
  isStreaming,
  typingMessage,
  typingLabel,
  bottomRef,
}: {
  messages: Msg[];
  isTyping: boolean;
  isStreaming: boolean;
  typingMessage: string;
  typingLabel: string;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 pb-32">
      <div className="container mx-auto max-w-4xl" data-tour="messages">
        {messages.map((m) => <MessageBubble key={m.id} m={m} />)}

        {(isTyping || isStreaming) && (
          <div className="mb-4 flex justify-start">
            <div className="max-w-[75%] bg-white border border-gray-200 shadow-sm rounded-lg p-4 italic text-gray-500">
              <div className="font-medium text-indigo-700 mb-1">{typingLabel}</div>
              <p>{typingMessage}</p>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
