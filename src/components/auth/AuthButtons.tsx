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
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={onLogin}
        className="px-3 py-1.5 text-sm rounded-lg border border-white/70 text-white hover:bg-white/10 transition"
      >
        Log in
      </button>
      <button
        onClick={onSignup}
        className="px-3 py-1.5 text-sm rounded-lg bg-yellow-400 text-indigo-900 font-semibold hover:bg-yellow-300 transition"
      >
        Sign up for free
      </button>
    </div>
  );
}
