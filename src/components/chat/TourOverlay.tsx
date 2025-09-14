// src/components/chat/TourOverlay.tsx
"use client";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { TourStep } from "@/hooks/userFirstRunTour";

type Props = {
  open: boolean;
  steps: TourStep[];
  stepIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
};

export default function TourOverlay({ open, steps, stepIndex, onNext, onPrev, onClose }: Props) {
  const step = steps[stepIndex];
  const [rect, setRect] = useState<DOMRect | null>(null);

  const updateRect = () => {
    if (!open || !step?.target) return setRect(null);
    const el = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
    if (!el) return setRect(null);
    const r = el.getBoundingClientRect();
    // Small padding to the highlight
    const padded = new DOMRect(
      r.left - 6,
      r.top - 6,
      r.width + 12,
      r.height + 12
    );
    setRect(padded);
  };

  useLayoutEffect(() => {
    updateRect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, stepIndex, step?.target]);

  useEffect(() => {
    if (!open) return;
    const onScrollOrResize = () => updateRect();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    const id = setInterval(updateRect, 200); // catch layout shifts
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step?.target, stepIndex]);

  const position = useMemo(() => {
    if (!rect) return { top: "50%", left: "50%", transform: "translate(-50%,-50%)" };
    // Try below the target if space, else above
    const vSpaceBelow = window.innerHeight - (rect.top + rect.height);
    const placeBelow = vSpaceBelow > 160; // enough for card height
    const top = placeBelow ? rect.top + rect.height + 10 : Math.max(16, rect.top - 140 - 10);
    const left = Math.min(Math.max(rect.left, 16), window.innerWidth - 360 - 16);
    return { top: `${top}px`, left: `${left}px`, transform: "none" as const };
  }, [rect]);

  if (!open || !step) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Scrim */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Highlight box */}
      {rect && (
        <div
          className="absolute pointer-events-none border-2 border-indigo-400 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
          style={{
            top: rect.top + "px",
            left: rect.left + "px",
            width: rect.width + "px",
            height: rect.height + "px",
          }}
          aria-hidden
        />
      )}

      {/* Tooltip card */}
      <div
        className="absolute max-w-sm w-[360px] bg-white rounded-xl shadow-xl border border-gray-200 p-4"
        style={position}
        role="dialog"
        aria-modal="true"
        aria-live="polite"
      >
        <div className="flex items-start justify-between">
          <div className="pr-4">
            <div className="text-sm font-semibold text-indigo-700">{step.title}</div>
            <p className="text-sm text-gray-700 mt-1">{step.body}</p>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 p-1 rounded"
            aria-label="Close tour"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={onPrev}
            disabled={stepIndex === 0}
            className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${
              stepIndex === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={16} />
            Back
          </button>

          <div className="text-xs text-gray-500">
            {stepIndex + 1} / {steps.length}
          </div>

          <button
            onClick={onNext}
            className="flex items-center gap-1 text-sm px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {stepIndex === steps.length - 1 ? "Got it" : <>Next <ChevronRight size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
