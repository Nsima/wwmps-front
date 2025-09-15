//src/components/chat/Header.tsx
"use client";

import { HelpCircle, LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import AuthButtons from "../auth/AuthButtons";
import { useAuth } from "@/hooks/useAuth";

export default function Header({
  label,
  onHelp,
}: {
  label: string;
  onHelp?: () => void;
}) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  // Compute initials: "JD" from "John Doe", else first letter of email, else "U"
  const initials = React.useMemo(() => {
    const name = (user?.name || "").trim();
    if (name) {
      const parts = name.split(/\s+/);
      const first = parts[0]?.[0] || "";
      const last = parts.length > 1 ? parts[parts.length - 1]?.[0] || "" : "";
      return (first + last || first).toUpperCase();
    }
    const email = user?.email || "";
    if (email) return email[0].toUpperCase();
    return "U";
  }, [user]);

  // Simple dropdown
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="relative z-40 bg-indigo-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          What Would <span className="text-yellow-300">{label}</span> Say?
        </h1>

        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <AuthButtons
              onLogin={() => router.push("/login")}
              onSignup={() => router.push("/signup")}
              className="flex-col sm:flex-row"
            />
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                aria-label="Account menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="w-9 h-9 rounded-full bg-yellow-400 text-indigo-900 font-semibold flex items-center justify-center shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                {initials}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-700 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3">
                    <div className="text-sm font-medium truncate">
                      {user?.name || user?.email || user?.phone || "Signed in"}
                    </div>
                    {user?.email && (
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false);
                      router.push("/account");
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <UserIcon size={16} />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                      router.refresh();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}

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
