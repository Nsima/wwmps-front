//src/components/chat/Header.tsx
"use client";
import { Settings, HelpCircle } from "lucide-react";
import AuthButtons from "../auth/AuthButtons";
import { useAuth } from "@/hooks/useAuth";

export default function Header({ label, onHelp }: { label: string; onHelp?: () => void }) {
  const { isAuthenticated, login, signup } = useAuth();

  return (
    <header className="bg-indigo-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          What Would <span className="text-yellow-300">{label}</span> Say?
        </h1>

        <div className="flex items-center gap-3">
          {/* Show CTA if not authenticated */}
          {!isAuthenticated && (
            <AuthButtons onLogin={login} onSignup={signup} />
          )}

          {/* Existing icons */}
          <button
            className="p-2 rounded-full hover:bg-indigo-600 transition-colors"
            aria-label="Help"
            onClick={onHelp}
            title="Show quick tour"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
