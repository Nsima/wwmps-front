//src/components/chat/Chatbot.tsx
"use client";

import Header from "./Header";
import PastorSwitcher from "./PastorSwitcher";
import MessageList from "./MessageList";
import Composer from "./Composer";
import { useChat } from "@/hooks/useChat";
import { useFirstRunTour } from "@/hooks/userFirstRunTour";
import TourOverlay from "./TourOverlay";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";
import { useInteractionGate } from "@/hooks/useInteractionGate";

export default function Chatbot() {
  const {
    pastors, selectedPastor, showPastorMenu, pastorQuery, activeIdx,
    messages, input, isBusy, isTyping, isStreaming, typingMessage,
    bottomRef, searchInputRef, filteredPastors,
    setPastorQuery, setActiveIdx, setShowPastorMenu, setInput,
    handleSendMessage, handleStop, handleKeyPress, selectPastor,
  } = useChat();

  const { isAuthenticated, login, signup } = useAuth();

  // Open once between 5–10 user interactions if not logged in
  const { open: gateOpen, close: closeGate } = useInteractionGate(messages, {
    min: 5,
    max: 10,
    disabled: isAuthenticated,
  });

  const {
    open, steps, stepIndex, next, prev, close, restart,
  } = useFirstRunTour();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header label={selectedPastor?.name || "…"} onHelp={restart} />

      <PastorSwitcher
        selectedPastor={selectedPastor}
        pastors={pastors}
        filteredPastors={filteredPastors}
        show={showPastorMenu}
        setShow={setShowPastorMenu}
        query={pastorQuery}
        setQuery={setPastorQuery}
        activeIdx={activeIdx}
        setActiveIdx={setActiveIdx}
        onSelect={selectPastor}
        searchInputRef={searchInputRef}
        hasThread={messages.length > 1}
      />

      <MessageList
        messages={messages}
        isTyping={isTyping}
        isStreaming={isStreaming}
        typingMessage={typingMessage}
        typingLabel={selectedPastor?.name || "…"}
        bottomRef={bottomRef}
      />

      <Composer
        value={input}
        onChange={setInput}
        onSend={handleSendMessage}
        onStop={handleStop}
        onKeyDown={handleKeyPress}
        disabled={isBusy}
        showStop={isBusy}
      />

      {/* First-run coach marks */}
      <TourOverlay
        open={open}
        steps={steps}
        stepIndex={stepIndex}
        onNext={next}
        onPrev={prev}
        onClose={close}
      />

      {/* Signup/Login Gate */}
      <Modal open={gateOpen} onClose={closeGate}>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-indigo-700">
            To continue, please sign up or log in.
          </h2>
          <p className="text-gray-700">
            You’ve reached the free preview limit. Create a free account to keep the conversation going
            and get better personalization (pastor preferences, history, and more).
          </p>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={signup}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Sign up for free
            </button>
            <button
              onClick={login}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Log in
            </button>
            <button
              onClick={closeGate}
              className="ml-auto text-sm text-gray-500 hover:text-gray-700"
            >
              Not now
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
