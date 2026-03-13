"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
            <h1 className="mt-1 text-2xl font-black text-white">Recover access</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
            >
              Back to Login
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

      <main className="mx-auto max-w-[900px] px-6 py-12 lg:px-10">
        <div
          className="rounded-[36px] border p-8 shadow-[0_28px_70px_rgba(79,37,42,0.10)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,250,244,0.96) 0%, rgba(251,243,185,0.86) 100%)",
            borderColor: "rgba(79,37,42,0.14)",
          }}
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "#4f252a" }}
          >
            <Mail size={28} color="#fff" />
          </div>

          <h2 className="mt-6 text-4xl font-black text-[#4f252a]">Reset your password</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7d5953]">
            Enter the email connected to your account and we will send a reset link so you can choose a new password.
          </p>

          {errorMessage && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
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

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full px-8 py-4 text-sm font-black text-white shadow-md transition disabled:opacity-60"
                style={{ backgroundColor: "#f1745e" }}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <Link
                href="/login"
                className="rounded-full border px-8 py-4 text-sm font-black text-[#4f252a]"
                style={{ borderColor: "rgba(79,37,42,0.14)", backgroundColor: "rgba(255,250,244,0.78)" }}
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
