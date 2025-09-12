"use client";
import type { Source } from "@/lib/types";

export default function Sources({ sources }: { sources: Source[] }) {
  if (!sources?.length) return null;
  return (
    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
      {sources.map(s => (
        <a
          key={s.chunk_id}
          href={s.source_url || "#"}
          target="_blank"
          rel="noreferrer"
          className="block px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200"
          title={s.source_url || ""}
        >
          <div className="text-xs font-medium truncate">{s.title || "Untitled"}</div>
          <div className="text-[11px] text-gray-500">
            {s.date || ""}
            {typeof s.score === "number" && <span> • score {s.score.toFixed(2)}</span>}
          </div>
        </a>
      ))}
    </div>
  );
}
