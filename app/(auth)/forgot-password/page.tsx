"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import bookFlowerImage from "../_assets/book-flower.png";
import journalImage from "../_assets/journal.png";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#f7e8d0] via-[#ecd3b2] to-[#f7e8d0]" />

      <header className="relative z-10 w-full h-[72px] bg-[#4f252a] border-b border-white/10 shadow-sm flex items-center">
        <div className="w-full px-4 sm:px-6 md:px-10 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-xl tracking-wide">
            Daily Journal
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/login" className="bg-white/10 hover:bg-white/15 text-white text-sm px-4 sm:px-5 py-2 rounded-lg font-semibold transition">
              Back to Login
            </Link>
            <Link href="/signup" className="bg-[#f1745e] hover:bg-[#df624f] text-white text-sm px-4 sm:px-6 py-2 rounded-lg font-semibold shadow-sm transition">
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
              <Image src={journalImage} alt="Daily Journal" className="w-[90px] sm:w-[110px] h-auto" priority />
              <h2 className="mt-4 sm:mt-5 text-2xl sm:text-3xl font-extrabold text-[#4f252a]">
                Forgot password?
              </h2>
              <p className="mt-2 text-[#4f252a]/80 text-sm sm:text-base leading-relaxed max-w-[46ch]">
                No worries. We&apos;ll help you reset it safely.
              </p>
            </div>

            <div className="mt-6 sm:mt-7 space-y-3">
              <div className="rounded-2xl border bg-white/55 px-5 py-4" style={{ borderColor: "rgba(79,37,42,0.14)" }}>
                <div className="flex items-center gap-3 text-[#4f252a] font-bold text-sm sm:text-base">
                  <span className="text-lg">🔑</span> Secure recovery
                </div>
                <p className="mt-1 text-[#4f252a]/75 text-xs sm:text-sm">
                  We will send a reset link to your email.
                </p>
              </div>
            </div>

            <div className="mt-8 lg:mt-auto pt-2 hidden lg:block">
              <Image src={bookFlowerImage} alt="Book with flowers" className="w-[300px] xl:w-[320px] h-auto opacity-95" />
            </div>
          </aside>

          <section className="relative flex-1 overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#ecd3b2] via-[#f7e8d0] to-[#ecd3b2]" />
            <div className="absolute -top-28 -right-28 z-0 pointer-events-none h-80 w-80 rounded-full bg-[#f1745e]/18 blur-3xl" />
            <div className="absolute -bottom-28 left-28 z-0 pointer-events-none h-80 w-80 rounded-full bg-[#f9efbc]/55 blur-3xl" />

            <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-8 py-8 lg:py-10">
              <div className="w-full max-w-xl lg:max-w-[680px]">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#4f252a] text-center mb-5 sm:mb-6">
                  Reset Password
                </h1>

                <div
                  className="bg-[#fffaf4]/95 backdrop-blur border rounded-[32px] p-6 sm:p-8 shadow-[0_28px_70px_rgba(79,37,42,0.10)]"
                  style={{ borderColor: "rgba(79,37,42,0.14)" }}
                >
                  <p className="text-center text-[#4f252a]/70 mb-6 text-base">
                    Enter your email and we&apos;ll send a reset link
                  </p>

                  {errorMessage && (
                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm sm:text-base text-red-700">
                      {errorMessage}
                    </div>
                  )}

                  <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-[#4f252a]">Email</label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-2xl px-5 py-3 text-base outline-none focus:ring-2 focus:ring-[#f1745e]/30 bg-white"
                        style={{ borderColor: "rgba(79,37,42,0.14)" }}
                        required
                      />
                    </div>

                    <div className="flex justify-center pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-12 sm:px-16 py-3 rounded-2xl text-base font-extrabold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition disabled:opacity-60"
                        style={{ background: "linear-gradient(90deg, #f1745e 0%, #df624f 100%)" }}
                      >
                        {loading ? "Sending..." : "Send Reset Link"}
                      </button>
                    </div>

                    <p className="text-center text-sm text-[#4f252a]/70 pt-1">
                      Remember your password?{" "}
                      <Link href="/login" className="text-[#f1745e] underline font-extrabold">
                        Back to Login
                      </Link>
                    </p>
                  </form>
                </div>

                <div className="mt-6 flex justify-center lg:hidden">
                  <Image src={bookFlowerImage} alt="Book with flowers" className="w-[260px] sm:w-[300px] h-auto opacity-95" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="relative z-10 w-full h-[60px] bg-[#4f252a] border-t border-white/10 flex items-center">
        <div className="w-full px-4 sm:px-6 md:px-10 flex items-center justify-center gap-6 sm:gap-10 md:gap-16 text-xs sm:text-sm font-medium text-white">
          <div className="flex items-center gap-2"><span className="text-lg">🛡️</span> Secure Data</div>
          <div className="flex items-center gap-2"><span className="text-lg">💗</span> Free to use</div>
          <div className="hidden sm:flex items-center gap-2"><span className="text-lg">📱</span> Sync across devices</div>
        </div>
      </footer>
    </div>
  );
}
