"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/check-email?type=reset");
  }

  return (
    <div className="min-h-screen md:h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#fbe3b9] via-[#edd0ac] to-[#fbe3b9]" />

      <header className="relative z-10 w-full h-[72px] bg-[#4f252a] border-b border-[#3a1b1f] shadow-md flex items-center">
        <div className="w-full px-4 sm:px-6 md:px-10 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-xl tracking-wide">
            Daily Journal
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="bg-white/10 hover:bg-white/15 text-white text-sm px-4 sm:px-5 py-2 rounded-lg font-semibold transition"
            >
              Back to Login
            </Link>

            <Link
              href="/signup"
              className="bg-[#e06464] hover:bg-[#f1745e] text-white text-sm px-4 sm:px-6 py-2 rounded-lg font-semibold shadow-sm transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 overflow-hidden">
        <aside
          className="hidden md:flex relative z-10 w-[420px] bg-[#f9efbc] border-r px-8 py-8 flex-col overflow-hidden"
          style={{ borderColor: "rgba(79,37,42,0.14)" }}
        >
          <div className="flex flex-col items-start">
            <img
              src="/images/journal.png"
              alt="Daily Journal"
              className="w-[110px] h-auto"
            />
            <h2 className="mt-5 text-3xl font-extrabold text-[#4f252a]">
              Forgot password?
            </h2>
            <p className="mt-2 text-[#4f252a]/80 text-base leading-relaxed">
              No worries. We’ll help you reset it safely.
            </p>
          </div>

          <div className="mt-7 space-y-3">
            <div className="rounded-2xl border bg-white/55 px-5 py-4" style={{ borderColor: "rgba(79,37,42,0.14)" }}>
              <div className="flex items-center gap-3 text-[#4f252a] font-bold text-base">
                <span className="text-lg">🔑</span> Secure recovery
              </div>
              <p className="mt-1 text-[#4f252a]/75 text-sm">
                We will send a reset link to your email.
              </p>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <img
              src="/images/Book-flower.png"
              alt="Book with flowers"
              className="w-[320px] h-auto opacity-95"
            />
          </div>
        </aside>

        <section className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#edd0ac] via-[#fbe3b9] to-[#edd0ac]" />
          <div className="absolute -top-28 -right-28 z-0 pointer-events-none h-80 w-80 rounded-full bg-[#e06464]/25 blur-3xl" />
          <div className="absolute -bottom-28 left-28 z-0 pointer-events-none h-80 w-80 rounded-full bg-[#f1745e]/20 blur-3xl" />

          <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 md:px-10 py-6">
            <div className="w-full max-w-[680px]">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#4f252a] text-center mb-6">
                Reset Password
              </h1>

              <div className="bg-white/90 backdrop-blur border border-black/10 rounded-3xl p-6 sm:p-8 shadow-xl">
                <p className="text-center text-[#4f252a]/70 mb-6 text-base">
                  Enter your email and we’ll send a reset link
                </p>

                {errorMessage && (
                  <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm sm:text-base text-red-700">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-[#4f252a]">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-black/15 rounded-2xl px-5 py-3 text-base outline-none focus:ring-2 focus:ring-[#e06464]/30 bg-white"
                      required
                    />
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-12 sm:px-16 py-3 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-[#e06464] to-[#f1745e] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition disabled:opacity-60"
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </div>

                  <p className="text-center text-sm text-[#4f252a]/70 pt-1">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="text-[#e06464] underline font-extrabold"
                    >
                      Back to Login
                    </Link>
                  </p>
                </form>
              </div>

              <div className="md:hidden mt-8 flex justify-center">
                <img
                  src="/images/Book-flower.png"
                  alt="Book with flowers"
                  className="w-[280px] h-auto opacity-95"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 w-full h-[60px] bg-[#4f252a] border-t border-[#3a1b1f] flex items-center">
        <div className="w-full px-4 sm:px-6 md:px-10 flex items-center justify-center gap-6 sm:gap-10 md:gap-16 text-xs sm:text-sm font-medium text-white">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛡️</span> Secure Data
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">💗</span> Free to use
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-lg">📱</span> Sync across devices
          </div>
        </div>
      </footer>
    </div>
  );
}
