"use client";
import { useEffect, useState } from "react";

export type TourStep = {
  id: string;              // "pastor" | "messages" | "composer"
  title: string;
  body: string;
  target: string;          // matches data-tour="..."
};

const KEY = "wwmps_tour_done";

export function useFirstRunTour(customSteps?: TourStep[]) {
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const steps: TourStep[] =
    customSteps ?? [
      {
        id: "pastor",
        target: "pastor",
        title: "Choose a Pastor",
        body: "Tap here to pick a pastor. Switching resets the current thread.",
      },
      {
        id: "messages",
        target: "messages",
        title: "Answers & Sources",
        body: "Responses appear here — with sermon source links when available.",
      },
      {
        id: "composer",
        target: "composer",
        title: "Ask & Stop",
        body: "Type your question and press Enter. Use “Stop” to cancel sending",
      },
    ];

  useEffect(() => {
    try {
      const done = localStorage.getItem(KEY);
      if (!done) setOpen(true);
    } catch { /* ignore */ }
  }, []);

  const close = () => {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setOpen(false);
    setStepIndex(0);
  };

  const restart = () => {
    setOpen(true);
    setStepIndex(0);
  };

  const next = () => {
    if (stepIndex >= steps.length - 1) return close();
    setStepIndex(s => s + 1);
  };

  const prev = () => setStepIndex(s => Math.max(0, s - 1));

  return { open, steps, stepIndex, next, prev, close, restart, setOpen, setStepIndex };
}
