//src/app/login/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    console.log("login submit", Object.fromEntries(fd.entries()));
    // TODO: call your real sign-in
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">Welcome back</h1>
          <p className="text-sm text-gray-600 mt-1">
            Log in to continue your conversation.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {/* Socials (stub) */}
          <div className="space-y-2">
            <button className="w-full rounded-lg border border-gray-300 hover:bg-gray-50 py-2.5 text-sm">
              Continue with Google
            </button>
            <button className="w-full rounded-lg border border-gray-300 hover:bg-gray-50 py-2.5 text-sm">
              Continue with Apple
            </button>
            <button className="w-full rounded-lg border border-gray-300 hover:bg-gray-50 py-2.5 text-sm">
              Continue with Phone
            </button>
          </div>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-500">or</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          {/* Email / Password */}
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-700">Email</span>
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Password</span>
              <div className="mt-1 flex items-stretch">
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  required
                  className="w-full rounded-l-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="px-3 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="remember" className="rounded" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a className="text-indigo-600 hover:underline" href="#">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white rounded-lg py-2.5 hover:bg-indigo-700 transition"
            >
              Log in
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-indigo-600 font-medium hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>

        <p className="text-[11px] text-gray-500 text-center mt-4">
          By continuing, you agree to our Terms and acknowledge our Privacy Policy.
        </p>
      </div>
    </main>
  );
}

