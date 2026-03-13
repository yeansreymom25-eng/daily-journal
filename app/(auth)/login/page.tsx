"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, PencilLine } from "lucide-react";
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
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #f7e8d0 0%, #ecd3b2 55%, #e5c5a0 100%)",
      }}
    >
      <header
        className="w-full border-b shadow-sm"
        style={{ backgroundColor: "#4f252a", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 lg:px-10">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Daily Journal</p>
            <h1 className="mt-1 text-2xl font-black text-white">Welcome back</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
            >
              Home
            </Link>
            <Link
              href="/signup"
              className="rounded-full px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
              style={{ backgroundColor: "#f1745e" }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1440px] gap-8 px-6 py-10 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
        <aside
          className="rounded-[32px] border p-6 shadow-[0_24px_60px_rgba(79,37,42,0.08)] lg:p-8"
          style={{ backgroundColor: "#f9efbc", borderColor: "rgba(79,37,42,0.14)" }}
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "#4f252a" }}
          >
            <PencilLine size={28} color="#fff" />
          </div>
          <h2 className="mt-6 text-3xl font-black text-[#4f252a]">Pick up where you left off.</h2>
          <p className="mt-4 text-sm leading-7 text-[#7d5953]">
            Continue writing, revisit drafts, and keep your reflections close in one calm space.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-[24px] border bg-white/60 p-5" style={{ borderColor: "rgba(79,37,42,0.14)" }}>
              <h3 className="text-lg font-black text-[#4f252a]">Private and personal</h3>
              <p className="mt-2 text-sm leading-6 text-[#7d5953]">Your journal stays focused on you and your thoughts.</p>
            </div>
            <div className="rounded-[24px] border bg-white/60 p-5" style={{ borderColor: "rgba(79,37,42,0.14)" }}>
              <h3 className="text-lg font-black text-[#4f252a]">Draft anytime</h3>
              <p className="mt-2 text-sm leading-6 text-[#7d5953]">Save unfinished ideas and return when the words feel right.</p>
            </div>
          </div>
        </aside>

        <section
          className="rounded-[36px] border p-6 shadow-[0_28px_70px_rgba(79,37,42,0.10)] sm:p-8"
          style={{ backgroundColor: "#fffaf4", borderColor: "rgba(79,37,42,0.14)" }}
        >
          <h2 className="text-4xl font-black text-[#4f252a]">Log In</h2>
          <p className="mt-3 text-sm leading-7 text-[#7d5953]">Enter your details to return to your journal.</p>

          {errorMessage && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-[#4f252a]">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border bg-white px-5 py-3 outline-none focus:ring-2 focus:ring-[#f1745e]/30"
                style={{ borderColor: "rgba(79,37,42,0.14)" }}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#4f252a]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border bg-white px-5 py-3 pr-14 outline-none focus:ring-2 focus:ring-[#f1745e]/30"
                  style={{ borderColor: "rgba(79,37,42,0.14)" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7d5953]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-semibold text-[#4f252a] underline hover:text-[#f1745e]">
                Forgot Password?
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full px-8 py-4 text-sm font-black text-white shadow-md transition disabled:opacity-60"
                style={{ backgroundColor: "#f1745e" }}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>

              <Link
                href="/signup"
                className="rounded-full border px-8 py-4 text-sm font-black text-[#4f252a]"
                style={{ borderColor: "rgba(79,37,42,0.14)", backgroundColor: "rgba(255,250,244,0.78)" }}
              >
                Create Account
              </Link>
            </div>
          </form>

          <div className="mt-8 rounded-[28px] border p-5" style={{ borderColor: "rgba(79,37,42,0.14)", backgroundColor: "rgba(249,239,188,0.45)" }}>
            <div className="flex items-center gap-3">
              <Lock size={18} color="#f1745e" />
              <p className="text-sm font-semibold text-[#4f252a]">Secure access to your writing archive</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
