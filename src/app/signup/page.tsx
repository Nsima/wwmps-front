//src/app/signup/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [showPw, setShowPw] = useState(false);
  const [usePhone, setUsePhone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    console.log("signup submit", Object.fromEntries(fd.entries()));
    // TODO: call your real sign-up
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">Create your account</h1>
          <p className="text-sm text-gray-600 mt-1">
            Save history, personalize pastors, and pick up where you left off.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="space-y-2">
            <button className="w-full rounded-lg border border-gray-300 hover:bg-gray-50 py-2.5 text-sm">
              Sign up with Google
            </button>
            <button className="w-full rounded-lg border border-gray-300 hover:bg-gray-50 py-2.5 text-sm">
              Sign up with Apple
            </button>
            <button
              type="button"
              onClick={() => setUsePhone(true)}
              className="w-full rounded-lg border border-gray-300 hover:bg-gray-50 py-2.5 text-sm"
            >
              Sign up with Phone
            </button>
          </div>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-500">or</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          {/* Fields */}
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-700">Full name</span>
              <input
                name="name"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="John Doe"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">{usePhone ? "Phone" : "Email"}</span>
              <input
                name={usePhone ? "phone" : "email"}
                type={usePhone ? "tel" : "email"}
                inputMode={usePhone ? "tel" : "email"}
                autoComplete={usePhone ? "tel" : "email"}
                pattern={usePhone ? "[+0-9 ()-]{7,}" : undefined}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder={usePhone ? "+234 801 234 5678" : "you@example.com"}
              />
              <div className="mt-1">
                <button
                  type="button"
                  onClick={() => setUsePhone((v) => !v)}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  {usePhone ? "Use email instead" : "Use phone instead"}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Password</span>
              <div className="mt-1 flex items-stretch">
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  required
                  minLength={8}
                  className="w-full rounded-l-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="px-3 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Use 8+ characters for a strong password.</p>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input required type="checkbox" className="rounded" />
              <span className="text-gray-600">
                I agree to the Terms and acknowledge the Privacy Policy.
              </span>
            </label>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white rounded-lg py-2.5 hover:bg-indigo-700 transition"
            >
              Create account
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <p className="text-[11px] text-gray-500 text-center mt-4">
          You can continue exploring as a guest, but some features may be limited.
        </p>
      </div>
    </main>
  );
}
