// src/components/chat/Chatbot.tsx

"use client";

import Header from "./Header";
import PastorSwitcher from "./PastorSwitcher";
import MessageList from "./MessageList";
import Composer from "./Composer";
import { useChat } from "@/hooks/useChat";
import { useFirstRunTour } from "@/hooks/userFirstRunTour";
import TourOverlay from "./TourOverlay";

export default function Chatbot() {
  const {
    pastors, selectedPastor, showPastorMenu, pastorQuery, activeIdx,
    messages, input, isBusy, isTyping, isStreaming, typingMessage,
    bottomRef, searchInputRef, filteredPastors,
    setPastorQuery, setActiveIdx, setShowPastorMenu, setInput,
    handleSendMessage, handleStop, handleKeyPress, selectPastor,
  } = useChat();

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
    </div>
  );
}
