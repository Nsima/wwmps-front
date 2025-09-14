//src/hooks/useInteractionGate.ts
"use client";
import { useEffect, useRef, useState } from "react";
import type { Msg } from "@/lib/types";

type Options = {
  min: number;
  max: number;
  storageKey?: string;
  disabled?: boolean; // e.g., user is authenticated
};

export function useInteractionGate(messages: Msg[], opts: Options) {
  const { min, max, storageKey = "wwmps_interactions", disabled } = opts;
  const [open, setOpen] = useState(false);
  const openedRef = useRef(false);

  const countKey = storageKey;
  const targetKey = `${storageKey}_target`;
  const guestKey = `${storageKey}_guest`;

  const get = (k: string) => {
    try { return localStorage.getItem(k); } catch { return null; }
  };
  const set = (k: string, v: string) => {
    try { localStorage.setItem(k, v); } catch {}
  };

  const getCount = () => parseInt(get(countKey) || "0", 10) || 0;
  const setCount = (n: number) => set(countKey, String(n));

  useEffect(() => {
    if (disabled) return;                       // logged-in users never see gate
    if (get(guestKey) === "1") return;          // guest mode suppresses gate

    const userMsgs = messages.filter((m) => m.isUser);
    const prev = getCount();

    if (userMsgs.length > prev) {
      const next = userMsgs.length;
      setCount(next);

      if (!openedRef.current) {
        let target = parseInt(get(targetKey) || "0", 10) || 0;
        if (!target) {
          target = Math.floor(Math.random() * (max - min + 1)) + min;
          set(targetKey, String(target));
        }
        if (next >= target) {
          setOpen(true);
          openedRef.current = true;
        }
      }
    }
  }, [messages, min, max, storageKey, disabled]);

  const close = () => setOpen(false);

  // NEW: remember guest choice for this browser until cleared.
  const continueAsGuest = () => {
    set(guestKey, "1");
    setOpen(false);
  };

  // Optional: expose a way to clear guest flag (e.g., after signup/login)
  const clearGuest = () => {
    try { localStorage.removeItem(guestKey); } catch {}
  };

  return { open, close, continueAsGuest, clearGuest };
}
