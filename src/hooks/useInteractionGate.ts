//src/hooks/useInteractionGate.ts
"use client";
import { useEffect, useRef, useState } from "react";
import type { Msg } from "@/lib/types";

type Options = {
  min: number; // lower bound (e.g., 5)
  max: number; // upper bound (e.g., 10)
  storageKey?: string; // localStorage key
  disabled?: boolean; // disable for logged-in users
};

/**
 * Tracks user-message count and opens once when threshold is crossed.
 * Persists count in localStorage so refreshes don't reset.
 */
export function useInteractionGate(messages: Msg[], opts: Options) {
  const { min, max, storageKey = "wwmps_interactions", disabled } = opts;
  const [open, setOpen] = useState(false);
  const openedRef = useRef(false);

  // load current count
  const getCount = () => {
    try {
      return parseInt(localStorage.getItem(storageKey) || "0", 10) || 0;
    } catch {
      return 0;
    }
  };

  const setCount = (n: number) => {
    try {
      localStorage.setItem(storageKey, String(n));
    } catch {}
  };

  // Increment when a new USER message arrives
  useEffect(() => {
    if (disabled) return;
    const userMsgs = messages.filter((m) => m.isUser);
    const count = getCount();

    if (userMsgs.length > count) {
      const next = userMsgs.length;
      setCount(next);

      if (!openedRef.current) {
        // pick a random threshold in [min, max]
        const targetKey = `${storageKey}_target`;
        let target = parseInt(localStorage.getItem(targetKey) || "0", 10) || 0;
        if (!target) {
          target = Math.floor(Math.random() * (max - min + 1)) + min;
          try { localStorage.setItem(targetKey, String(target)); } catch {}
        }

        if (next >= target) {
          setOpen(true);
          openedRef.current = true; // open once per session
        }
      }
    }
  }, [messages, min, max, storageKey, disabled]);

  const close = () => setOpen(false);

  return { open, close };
}
