// src/components/chat/PastorSwitcher.tsx
"use client";

import Image from "next/image";
import { ChevronDown, Search, X } from "lucide-react";
import type { Pastor } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";

type Props = {
  selectedPastor: Pastor;
  pastors: Pastor[];
  filteredPastors: Pastor[];
  show: boolean;
  setShow: (v: boolean) => void;
  query: string;
  setQuery: (v: string) => void;
  activeIdx: number;
  setActiveIdx: (n: number) => void;
  onSelect: (p: Pastor) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  hasThread: boolean;
};

export default function PastorSwitcher(props: Props) {
  const {
    selectedPastor, filteredPastors, show, setShow,
    query, setQuery, activeIdx, setActiveIdx, onSelect, searchInputRef, hasThread
  } = props;

  const [pending, setPending] = useState<Pastor | null>(null);
  const empty = useMemo(() => filteredPastors.length === 0, [filteredPastors]);

  // Ensure active index in bounds when list changes
  useEffect(() => {
    if (activeIdx >= filteredPastors.length) setActiveIdx(0);
  }, [filteredPastors.length, activeIdx, setActiveIdx]);

  const close = () => {
    setPending(null);
    setShow(false);
  };

  const handlePick = (p: Pastor) => {
    if (!hasThread || selectedPastor.slug === p.slug) {
      onSelect(p);
      close();
      return;
    }
    setPending(p); // show inline confirm UI
  };

  const confirmSwitch = () => {
    if (pending) {
      onSelect(pending);
      setPending(null);
      close();
    }
  };

  const cancelSwitch = () => setPending(null);

  return (
    <div className="bg-indigo-600 text-white p-3 relative" data-tour="pastor">
      <div className="container mx-auto flex justify-between items-center">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => setShow(!show)}
          role="button"
          aria-haspopup="dialog"
          aria-expanded={show}
        >
          <Image
            src={selectedPastor?.avatar || "/avatars/placeholder.jpg"}
            alt={selectedPastor?.name || "Pastor"}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
            priority
          />
          <div>
            <div className="font-medium flex items-center">
              {selectedPastor?.name || "Loading…"} <ChevronDown size={16} className="ml-1" />
            </div>
            <div className="text-xs text-indigo-200">{selectedPastor?.era || ""}</div>
          </div>
        </div>

        {/* Modal overlay replaces the old absolute dropdown */}
        <Modal open={show} onClose={close}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Select Pastor</h3>
            <button
              onClick={close}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mb-3">
            <label className="sr-only" htmlFor="pastor-search">Search pastors</label>
            <div className="flex items-center rounded-md border border-gray-300 focus-within:ring-1 focus-within:ring-indigo-500">
              <Search size={16} className="mx-2 text-gray-400" />
              <input
                id="pastor-search"
                ref={searchInputRef}
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setActiveIdx(0);
                }}
                onKeyDown={e => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveIdx(Math.min(activeIdx + 1, Math.max(0, filteredPastors.length - 1)));
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveIdx(Math.max(activeIdx - 1, 0));
                  }
                  if (e.key === "Enter") {
                    const p = filteredPastors[activeIdx];
                    if (p) handlePick(p);
                  }
                  if (e.key === "Escape") close();
                }}
                placeholder="Search by name, era, or slug…"
                className="w-full p-2 pr-3 bg-transparent focus:outline-none"
              />
            </div>
            {hasThread && (
              <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Switching pastors will start a new conversation.
              </p>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto" role="listbox" aria-label="Pastors">
            {empty && <div className="px-1 py-3 text-sm text-gray-500">No matches</div>}
            {filteredPastors.map((pastor, idx) => {
              const isActive = idx === activeIdx;
              const isSelected = selectedPastor?.id === pastor.id;
              return (
                <div
                  key={pastor.id}
                  className={`flex items-center space-x-3 px-2 py-2 cursor-pointer rounded-md ${isActive ? "bg-indigo-50" : "hover:bg-gray-100"}`}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => handlePick(pastor)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <Image
                    src={pastor.avatar || "/avatars/placeholder.jpg"}
                    alt={pastor.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium">{pastor.name}</div>
                    <div className="text-xs text-gray-500">{pastor.era}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inline confirmation (replaces window.confirm) */}
          {pending && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3">
              <p className="text-sm text-rose-800">
                Switch to <span className="font-semibold">{pending.name}</span> and clear the current thread?
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={confirmSwitch}
                  className="rounded-lg bg-rose-600 text-white px-3 py-1.5 text-sm hover:bg-rose-700"
                >
                  Yes, switch
                </button>
                <button
                  onClick={cancelSwitch}
                  className="rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
