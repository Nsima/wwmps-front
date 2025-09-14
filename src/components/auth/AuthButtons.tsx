//src/components/auth/AuthButtons.tsx

"use client";
import React from "react";

export default function AuthButtons({
  onLogin,
  onSignup,
  className = "",
}: {
  onLogin: () => void;
  onSignup: () => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-col sm:flex-row items-center gap-2 ${className}`}>
      <button
        onClick={onLogin}
        className="w-full sm:w-auto px-3 py-1.5 text-sm rounded-lg border border-white/70 text-white hover:bg-white/10 transition whitespace-nowrap"
      >
        Log in
      </button>
      <button
        onClick={onSignup}
        className="w-full sm:w-auto px-3 py-1.5 text-sm rounded-lg bg-yellow-400 text-indigo-900 font-semibold hover:bg-yellow-300 transition whitespace-nowrap"
      >
        Sign up for free
      </button>
    </div>
  );
}
