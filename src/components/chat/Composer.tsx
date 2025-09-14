// src/components/chat/Composer.tsx
"use client";
import { Send } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onStop: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
  showStop: boolean;
};

export default function Composer({
  value, onChange, onSend, onStop, onKeyDown, disabled, showStop
}: Props) {
  return (
    <div className="fixed bottom-0 w-full border-t bg-white p-4 z-50">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-end bg-white rounded-lg border border-gray-300 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask anything..."
            className="flex-1 p-3 bg-transparent focus:outline-none resize-none max-h-32"
            rows={1}
            disabled={disabled}
            data-tour="composer"
          />
          {showStop ? (
            <button
              onClick={onStop}
              className="p-3 rounded-r-lg text-red-600 hover:text-red-800"
              aria-label="Stop"
              title="Stop generating"
              autoFocus
            >
              Stop
            </button>
          ) : (
            <button
              onClick={onSend}
              disabled={!value.trim() || disabled}
              className={`p-3 rounded-r-lg ${value.trim() ? "text-indigo-600 hover:text-indigo-800" : "text-gray-400"}`}
              aria-label="Send"
            >
              <Send size={20} />
            </button>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Responses are AI-generated interpretations of sermons.
        </div>
      </div>
    </div>
  );
}
