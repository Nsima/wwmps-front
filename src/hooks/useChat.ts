// src/hooks/useChat.ts
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import type { Pastor, Msg, Source, AskResponse } from "@/lib/types";
import { FALLBACK_PASTORS, API_BASE, PASTORS_URL, ASK_TIMEOUT_MS, TOP_K } from "@/lib/config";
import { normalize, makeSessionId, newId, isGreeting, instantGreeting } from "@/lib/utils";

/** ----- helpers & type guards ----- */
type PastorsFile = { pastors?: unknown };
const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
const HONORIFICS = [
  "apostle","archbishop","bishop","dr","dr.","prophet","prophetess","evangelist",
  "pastor","pst","pst.","rev","rev.","reverend","prof","prof.","professor",
  "sir","bro","bro.","sis","mrs","mrs.","mr","mr.","ms","ms."
];
function stripHonorifics(fullName: string): string {
  let s = fullName.trim();
  // Remove up to a few stacked prefixes like "Rev. Dr."
  for (let i = 0; i < 3; i++) {
    let changed = false;
    for (const h of HONORIFICS) {
      const re = new RegExp(`^${h}\\s+`, "i");
      if (re.test(s)) {
        s = s.replace(re, "");
        changed = true;
      }
    }
    if (!changed) break;
  }
  return s.trim().replace(/\s+/g, " ");
}
function splitNameParts(clean: string): { surname: string; given: string } {
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return { surname: parts[0], given: "" };
  const surname = parts[parts.length - 1];
  const given = parts.slice(0, -1).join(" ");
  return { surname, given };
}

// Toggle between surname-first or given-name-first ordering.
type SortMode = "surname" | "given";
const SORT_MODE: SortMode = "given";

function sortPastorsByPersonName(arr: Pastor[]): Pastor[] {
  return [...arr].sort((a, b) => {
    const aClean = stripHonorifics(a.name);
    const bClean = stripHonorifics(b.name);
    if (SORT_MODE === "surname") {
      const aParts = splitNameParts(aClean);
      const bParts = splitNameParts(bClean);
      const bySurname = collator.compare(aParts.surname, bParts.surname);
      if (bySurname !== 0) return bySurname;
      const byGiven = collator.compare(aParts.given, bParts.given);
      if (byGiven !== 0) return byGiven;
    } else {
      const byFull = collator.compare(aClean, bClean);
      if (byFull !== 0) return byFull;
    }
    // final stable tiebreaker
    return collator.compare(a.slug, b.slug);
  });
}
function normalizePastors(payload: unknown): Pastor[] {
  const arr: unknown[] =
    Array.isArray(payload)
      ? payload
      : (typeof payload === "object" &&
         payload !== null &&
         Array.isArray((payload as PastorsFile).pastors as unknown[]))
        ? ((payload as PastorsFile).pastors as unknown[])
        : [];

  return arr
    .map((raw, i) => {
      if (!raw || typeof raw !== "object") return null;

      const p = raw as Partial<Record<keyof Pastor | "era" | "avatar", unknown>>;
      const id = typeof p.id === "number" && Number.isFinite(p.id) ? p.id : i + 1;
      const slug = String((p.slug ?? "") as string).toLowerCase();
      const name = String((p.name ?? "") as string);
      const era = typeof p.era === "string" ? p.era : "";
      const avatar = typeof p.avatar === "string" ? p.avatar : "/avatars/placeholder.jpg";

      return { id, slug, name, era, avatar } as Pastor;
    })
    .filter((p): p is Pastor => Boolean(p && p.slug && p.name));
}

export function useChat() {
  // pastors
  const sortedFallback = sortPastorsByPersonName([...FALLBACK_PASTORS]);
  const [pastors, setPastors] = useState<Pastor[]>(sortedFallback);
  const [selectedPastor, setSelectedPastor] = useState<Pastor>(sortedFallback[0]);
  const [pastorQuery, setPastorQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [showPastorMenu, setShowPastorMenu] = useState(false);

  // thread
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: newId(),
      text: "Hello! I'm here to provide spiritual guidance and answer questions as if I were a pastor. How can I help you today?",
      isUser: false,
      pastorName: sortedFallback[0].name,
    },
  ]);
  const [input, setInput] = useState("");

  // generation
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const isBusy = isTyping || isStreaming;

  // infra
  const thinkingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const esRef = useRef<EventSource | null>(null);
  const fetchCtrlRef = useRef<AbortController | null>(null);
  const inFlightRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [sessionId] = useState(() => {
    const KEY = "wwmps_session_id";
    const existing = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    const id = existing || makeSessionId();
    try { localStorage.setItem(KEY, id); } catch {}
    return id;
  });

  // load pastors
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(PASTORS_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        const list = sortPastorsByPersonName(normalizePastors(data));
        if (list.length) {
          setPastors(list);
          setSelectedPastor(list[0]);
          setMessages(prev => prev.map((m, i) => (i === 0 ? { ...m, pastorName: list[0].name } : m)));
        }
      } catch {
        console.warn("Using fallback pastors (failed to fetch pastors.json).");
      }
    })();
  }, []);

  // filtered list
  const filteredPastors = useMemo(() => {
    const q = normalize(pastorQuery);
    if (!q) return pastors;
    const matches = pastors.filter(
      (p) => normalize(p.name).includes(q) || normalize(p.slug).includes(q) || normalize(p.era || "").includes(q)
    );
    return sortPastorsByPersonName(matches);
  }, [pastorQuery, pastors]);

  // scroll on changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingMessage, isStreaming]);

  // cleanup
  useEffect(() => {
    return () => {
      if (thinkingTimer.current) clearInterval(thinkingTimer.current);
      if (esRef.current) { try { esRef.current.close(); } catch {} esRef.current = null; }
      try { fetchCtrlRef.current?.abort(); } catch {}
    };
  }, []);

  // open menu: focus search
  useEffect(() => {
    if (showPastorMenu) {
      setPastorQuery("");
      setActiveIdx(0);
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [showPastorMenu]);

  /* ---- network callers ---- */

  const askViaSSE = useCallback((question: string, pastorSlug: string, onToken: (s: string) => void) => {
    return new Promise<{ answer: string; sources: Source[]; model?: string; cached?: boolean }>((resolve, reject) => {
      const params = new URLSearchParams({
        question,
        pastor_slug: pastorSlug,
        top_k: String(TOP_K),
        session_id: sessionId,
      });

      // API_BASE is "" in browser -> relative HTTPS; absolute on server
      const url = `${API_BASE}/ask/stream?${params.toString()}`;

      if (esRef.current) { try { esRef.current.close(); } catch {} }
      const es = new EventSource(url, { withCredentials: false });
      esRef.current = es;

      let finalAnswer = "";
      let finalSources: Source[] = [];
      let finalModel: string | undefined;
      let gotFirstToken = false;

      const firstTokenTimer: ReturnType<typeof setTimeout> = setTimeout(() => {
        if (!gotFirstToken) {
          try { es.close(); } catch {}
          esRef.current = null;
          reject(new Error("first_token_timeout"));
        }
      }, 1800);

      es.addEventListener("token", (ev: MessageEvent<string>) => {
        const delta = String(ev.data || "");
        finalAnswer += delta;
        onToken(delta);
        if (!gotFirstToken) { gotFirstToken = true; clearTimeout(firstTokenTimer); }
      });

      es.addEventListener("final", (ev: MessageEvent<string>) => {
        try {
          const j = JSON.parse(String(ev.data || "{}")) as {
            answer?: string; sources?: Source[]; model?: string; cached?: boolean;
          };
          finalAnswer = j.answer ?? finalAnswer;
          finalSources = Array.isArray(j.sources) ? j.sources : [];
          finalModel = j.model;
        } catch {}
        try { es.close(); } catch {}
        esRef.current = null;
        clearTimeout(firstTokenTimer);
        resolve({ answer: finalAnswer, sources: finalSources, model: finalModel });
      });

      es.addEventListener("error", () => {
        try { es.close(); } catch {}
        esRef.current = null;
        clearTimeout(firstTokenTimer);
        reject(new Error("SSE failed"));
      });
    });
  }, [sessionId]);

  const fetchAnswerFromBackend = useCallback(
    async (question: string, pastorSlug: string, controller: AbortController): Promise<AskResponse> => {
      const timeout = setTimeout(() => controller.abort(), ASK_TIMEOUT_MS);
      fetchCtrlRef.current = controller;
      try {
        const res = await fetch(`${API_BASE}/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, pastor_slug: pastorSlug, top_k: TOP_K, session_id: sessionId }),
          signal: controller.signal,
        });

        type AskRaw = Partial<AskResponse> & { error?: string };
        const raw: AskRaw = await res.json().catch(() => ({} as AskRaw));

        if (!res.ok) {
          throw new Error(raw.error ?? `HTTP ${res.status}`);
        }

        const answer = typeof raw.answer === "string" ? raw.answer : "";
        const sources = Array.isArray(raw.sources) ? (raw.sources as Source[]) : [];

        return { answer, sources };
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") {
          return { answer: "(stopped)", sources: [] };
        }
        const msg = e instanceof Error ? e.message : String(e);
        console.error("Backend /ask failed:", msg);
        return { answer: "Sorry, I couldn't fetch a response. Please try again.", sources: [] };
      } finally {
        clearTimeout(timeout);
        fetchCtrlRef.current = null;
      }
    },
    [sessionId]
  );

  /* ---- actions ---- */

  const handleSendMessage = useCallback(() => {
    if (!input.trim() || !selectedPastor?.slug) return;
    if (inFlightRef.current || isBusy) return; // race-proof
    inFlightRef.current = true;

    const userText = input.trim();
    const current = selectedPastor;

    // instant greeting
    if (isGreeting(userText)) {
      const userMessage: Msg = { id: newId(), text: userText, isUser: true };
      const botMessage: Msg  = { id: newId(), text: instantGreeting(current.name), isUser: false, pastorName: current.name };
      setMessages(prev => [...prev, userMessage, botMessage]);
      setInput("");
      inFlightRef.current = false;
      return;
    }

    // add user
    const userMessage: Msg = { id: newId(), text: userText, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // typing loop
    setIsTyping(true);
    setTypingMessage("");
    let dot = 0;
    if (thinkingTimer.current) clearInterval(thinkingTimer.current);
    thinkingTimer.current = setInterval(() => {
      dot = (dot + 1) % 4;
      setTypingMessage(`Let me prayerfully consider that${".".repeat(dot)}`);
    }, 500);

    // show Stop
    setIsStreaming(true);

    // try SSE
    askViaSSE(userText, current.slug, (delta) => {
      setTypingMessage(prev => (prev ? prev + delta : delta));
    })
      .then(({ answer, sources }) => {
        if (thinkingTimer.current) clearInterval(thinkingTimer.current);
        setIsTyping(false);
        setIsStreaming(false);
        setTypingMessage("");
        inFlightRef.current = false;

        setMessages(prev => [...prev, {
          id: newId(),
          text: answer || "(no answer)",
          isUser: false,
          pastorName: current.name,
          sources: sources || [],
        }]);
      })
      .catch(async () => {
        // fallback /ask
        const controller = new AbortController();
        const { answer, sources } = await fetchAnswerFromBackend(userText, current.slug, controller);

        if (thinkingTimer.current) clearInterval(thinkingTimer.current);
        setIsTyping(false);
        setIsStreaming(false);
        setTypingMessage("");
        inFlightRef.current = false;

        setMessages(prev => [...prev, {
          id: newId(),
          text: answer || "(no answer)",
          isUser: false,
          pastorName: current.name,
          sources: sources || [],
        }]);
      });
  }, [input, selectedPastor, isBusy, askViaSSE, fetchAnswerFromBackend]);

  const handleStop = useCallback(() => {
    if (esRef.current) { try { esRef.current.close(); } catch {} esRef.current = null; }
    try { fetchCtrlRef.current?.abort(); } catch {}

    if (thinkingTimer.current) clearInterval(thinkingTimer.current);
    setIsTyping(false);
    setIsStreaming(false);
    setTypingMessage("");
    inFlightRef.current = false;
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isBusy && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectPastor = (p: Pastor) => {
    // cancel in-flight
    try { esRef.current?.close(); } catch {}
    try { fetchCtrlRef.current?.abort(); } catch {}
    setIsStreaming(false);
    setIsTyping(false);
    inFlightRef.current = false;

    setSelectedPastor(p);
    setMessages([{
      id: newId(),
      text: `Hello! I’m ${p.name}. I'm here to provide spiritual guidance and answer questions as if I were a pastor. How can I help you today?`,
      isUser: false,
      pastorName: p.name,
    }]);
    setShowPastorMenu(false);
  };

  return {
    // state
    pastors, selectedPastor, showPastorMenu, pastorQuery, activeIdx,
    messages, input, isBusy, isTyping, isStreaming, typingMessage,

    // refs
    bottomRef, searchInputRef,

    // derivations
    filteredPastors,

    // setters
    setPastorQuery, setActiveIdx, setShowPastorMenu, setInput,

    // actions
    handleSendMessage, handleStop, handleKeyPress, selectPastor,
  };
}
