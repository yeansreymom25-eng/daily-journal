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
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#f7e8d0] via-[#ecd3b2] to-[#f7e8d0]" />

      <header className="relative z-10 w-full bg-[#4f252a] border-b border-white/10 shadow-sm">
        <div className="w-full px-4 sm:px-8 lg:px-10 h-[72px] flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg sm:text-xl tracking-wide">
            Daily Journal
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm px-3 sm:px-5 py-2 rounded-lg font-semibold transition">
              Back to Home
            </Link>
            <Link href="/signup" className="bg-[#f1745e] hover:bg-[#df624f] text-white text-xs sm:text-sm px-4 sm:px-6 py-2 rounded-lg font-semibold shadow-sm transition">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-hidden">
        <div className="h-full flex flex-col lg:flex-row">
          <aside
            className="relative z-10 w-full lg:w-[420px] bg-[#f9efbc] border-b lg:border-b-0 lg:border-r px-5 sm:px-8 py-8 flex flex-col shadow-[0_24px_60px_rgba(79,37,42,0.08)]"
            style={{ borderColor: "rgba(79,37,42,0.14)" }}
          >
            <div className="flex flex-col items-start">
              <img src="/images/journal.png" alt="Daily Journal" className="w-[90px] sm:w-[110px] h-auto" draggable={false} />
              <h2 className="mt-4 sm:mt-5 text-2xl sm:text-3xl font-extrabold text-[#4f252a]">Welcome back</h2>
              <p className="mt-2 text-[#4f252a]/80 text-sm sm:text-base leading-relaxed max-w-[46ch]">
                Log in to continue writing, saving drafts, and tracking your mood.
              </p>
            </div>

            <div className="mt-6 sm:mt-7 space-y-3">
              <div className="rounded-2xl border bg-white/55 px-5 py-4" style={{ borderColor: "rgba(79,37,42,0.14)" }}>
                <div className="flex items-center gap-3 text-[#4f252a] font-bold text-sm sm:text-base">
                  <span className="text-lg">🔒</span> Private & secure
                </div>
                <p className="mt-1 text-[#4f252a]/75 text-xs sm:text-sm">Your entries stay safe and personal.</p>
              </div>

              <div className="rounded-2xl border bg-white/55 px-5 py-4" style={{ borderColor: "rgba(79,37,42,0.14)" }}>
                <div className="flex items-center gap-3 text-[#4f252a] font-bold text-sm sm:text-base">
                  <span className="text-lg">📝</span> Draft anytime
                </div>
                <p className="mt-1 text-[#4f252a]/75 text-xs sm:text-sm">Save unfinished thoughts and come back later.</p>
              </div>

              <div className="rounded-2xl border bg-white/55 px-5 py-4" style={{ borderColor: "rgba(79,37,42,0.14)" }}>
                <div className="flex items-center gap-3 text-[#4f252a] font-bold text-sm sm:text-base">
                  <span className="text-lg">📱</span> Use anywhere
                </div>
                <p className="mt-1 text-[#4f252a]/75 text-xs sm:text-sm">Phone, tablet, or laptop, your journal follows you.</p>
              </div>
            </div>

            <div className="mt-8 lg:mt-auto pt-2 hidden lg:block">
              <img src="/images/book-flower.png" alt="Book with flowers" className="w-[300px] xl:w-[320px] h-auto opacity-95" draggable={false} />
            </div>
          </aside>

          <section className="relative flex-1 overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#ecd3b2] via-[#f7e8d0] to-[#ecd3b2]" />
            <div className="absolute -top-28 -right-28 z-0 pointer-events-none h-80 w-80 rounded-full bg-[#f1745e]/18 blur-3xl" />
            <div className="absolute -bottom-28 left-28 z-0 pointer-events-none h-80 w-80 rounded-full bg-[#f9efbc]/55 blur-3xl" />

            <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-8 py-8 lg:py-10">
              <div className="w-full max-w-xl lg:max-w-[680px]">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#4f252a] text-center mb-5 sm:mb-6">Log In</h1>

                <div className="bg-[#fffaf4]/95 backdrop-blur border rounded-[32px] p-6 sm:p-8 shadow-[0_28px_70px_rgba(79,37,42,0.10)]" style={{ borderColor: "rgba(79,37,42,0.14)" }}>
                  <p className="text-center text-[#4f252a]/70 mb-5 sm:mb-6 text-sm sm:text-base">Please enter your login details below</p>

                  {errorMessage && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm sm:text-base text-red-700">{errorMessage}</div>}

                  <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-[#4f252a]">Email</label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-2xl px-4 sm:px-5 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#f1745e]/30 bg-white"
                        style={{ borderColor: "rgba(79,37,42,0.14)" }}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-[#4f252a]">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full border rounded-2xl px-4 sm:px-5 py-3 pr-12 sm:pr-14 text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#f1745e]/30 bg-white"
                          style={{ borderColor: "rgba(79,37,42,0.14)" }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-base sm:text-lg opacity-80 hover:opacity-100 transition"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button>
                      </div>
                    </div>

                    <div className="text-sm sm:text-base">
                      <Link href="/forgot-password" className="text-[#4f252a] underline font-semibold hover:text-[#f1745e] transition">
                        Forgot Password?
                      </Link>
                    </div>

                    <div className="flex justify-center pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto sm:px-20 px-8 py-3 rounded-2xl text-sm sm:text-base font-extrabold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition disabled:opacity-60"
                        style={{ background: "linear-gradient(90deg, #f1745e 0%, #df624f 100%)" }}
                      >
                        {loading ? "Logging in..." : "Log In"}
                      </button>
                    </div>

                    <p className="text-center text-xs sm:text-sm text-[#4f252a]/70 pt-1">
                      Don&apos;t have an account? <Link href="/signup" className="text-[#f1745e] underline font-extrabold">Sign Up</Link>
                    </p>
                  </form>
                </div>

                <div className="mt-6 flex justify-center lg:hidden">
                  <img src="/images/book-flower.png" alt="Book with flowers" className="w-[260px] sm:w-[300px] h-auto opacity-95" draggable={false} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="relative z-10 w-full bg-[#4f252a] border-t border-white/10">
        <div className="w-full px-4 sm:px-8 lg:px-10 py-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-xs sm:text-sm font-medium text-white">
          <div className="flex items-center gap-2"><span className="text-base sm:text-lg">🛡️</span> Secure Data</div>
          <div className="flex items-center gap-2"><span className="text-base sm:text-lg">💗</span> Free to use</div>
          <div className="flex items-center gap-2"><span className="text-base sm:text-lg">📱</span> Sync across devices</div>
        </div>
      </footer>
    </div>
  );
}
