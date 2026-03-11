"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
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
              href="/"
              className="bg-white/10 hover:bg-white/15 text-white text-sm px-4 sm:px-5 py-2 rounded-lg font-semibold transition"
            >
              Back to Home
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

      <main className="relative z-10 flex-1 flex overflow-hidden">
        <aside className="hidden md:flex relative z-10 w-[420px] bg-[#fbe3b9] border-r border-[#e6c9a4] px-8 py-8 flex-col overflow-hidden">
          <div className="flex flex-col items-start">
            <img
              src="/images/journal.png"
              alt="Daily Journal"
              className="w-[110px] h-auto"
            />
            <h2 className="mt-5 text-3xl font-extrabold text-[#4f252a]">
              Welcome back
            </h2>
            <p className="mt-2 text-[#4f252a]/80 text-base leading-relaxed">
              Log in to continue writing, saving drafts, and tracking your mood.
            </p>
          </div>

          <div className="mt-7 space-y-3">
            <div className="rounded-2xl border border-black/10 bg-white/55 px-5 py-4">
              <div className="flex items-center gap-3 text-[#4f252a] font-bold text-base">
                <span className="text-lg">🔒</span> Private & secure
              </div>
              <p className="mt-1 text-[#4f252a]/75 text-sm">
                Your entries stay safe and personal.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/55 px-5 py-4">
              <div className="flex items-center gap-3 text-[#4f252a] font-bold text-base">
                <span className="text-lg"></span> Draft anytime
              </div>
              <p className="mt-1 text-[#4f252a]/75 text-sm">
                Save unfinished thoughts and come back later.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/55 px-5 py-4">
              <div className="flex items-center gap-3 text-[#4f252a] font-bold text-base">
                <span className="text-lg">📱</span> Sync across devices
              </div>
              <p className="mt-1 text-[#4f252a]/75 text-sm">
                Use it anywhere—phone, tablet, or laptop.
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
                Log In
              </h1>

              <div className="bg-white/90 backdrop-blur border border-black/10 rounded-3xl p-6 sm:p-8 shadow-xl">
                <p className="text-center text-[#4f252a]/70 mb-6 text-base">
                  Please enter your login details below
                </p>

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

                  <div>
                    <label className="block text-sm font-bold mb-2 text-[#4f252a]">
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-black/15 rounded-2xl px-5 py-3 pr-14 text-base outline-none focus:ring-2 focus:ring-[#e06464]/30 bg-white"
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-lg opacity-80 hover:opacity-100 transition"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <div className="text-base">
                    <Link
                      href="/forgot-password"
                      className="text-[#4f252a] underline font-semibold hover:text-[#e06464] transition"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-14 sm:px-20 py-3 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-[#e06464] to-[#f1745e] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition disabled:opacity-60"
                    >
                      {loading ? "Logging in..." : "Log In"}
                    </button>
                  </div>

                  <p className="text-center text-sm text-[#4f252a]/70 pt-1">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="text-[#e06464] underline font-extrabold"
                    >
                      Sign Up
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