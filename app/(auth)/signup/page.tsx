"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
      setErrorMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${siteUrl}/login`,
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (!data.session) {
      setMessage("Account created successfully. Please check your email to confirm your account.");
      router.push("/check-email?type=signup");
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
            <h1 className="mt-1 text-2xl font-black text-white">Create your account</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="rounded-full px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
              style={{ backgroundColor: "#f1745e" }}
            >
              Log In
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
            <Sparkles size={28} color="#fff" />
          </div>
          <h2 className="mt-6 text-3xl font-black text-[#4f252a]">Start a quieter daily habit.</h2>
          <p className="mt-4 text-sm leading-7 text-[#7d5953]">
            Build a place for your reflections, save unfinished ideas, and keep your writing organized with ease.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-[24px] border bg-white/60 p-5" style={{ borderColor: "rgba(79,37,42,0.14)" }}>
              <h3 className="text-lg font-black text-[#4f252a]">Consistent by design</h3>
              <p className="mt-2 text-sm leading-6 text-[#7d5953]">Return each day to one calm writing space.</p>
            </div>
            <div className="rounded-[24px] border bg-white/60 p-5" style={{ borderColor: "rgba(79,37,42,0.14)" }}>
              <h3 className="text-lg font-black text-[#4f252a]">Private and personal</h3>
              <p className="mt-2 text-sm leading-6 text-[#7d5953]">Your memories and thoughts stay organized around you.</p>
            </div>
          </div>
        </aside>

        <section
          className="rounded-[36px] border p-6 shadow-[0_28px_70px_rgba(79,37,42,0.10)] sm:p-8"
          style={{ backgroundColor: "#fffaf4", borderColor: "rgba(79,37,42,0.14)" }}
        >
          <h2 className="text-4xl font-black text-[#4f252a]">Sign Up</h2>
          <p className="mt-3 text-sm leading-7 text-[#7d5953]">Create your account and start building your journal.</p>

          {message && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              {message}
            </div>
          )}

          {errorMessage && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-[#4f252a]">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border bg-white px-5 py-3 outline-none focus:ring-2 focus:ring-[#f1745e]/30"
                style={{ borderColor: "rgba(79,37,42,0.14)" }}
                required
              />
            </div>

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
                  placeholder="Create a password"
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

            <div>
              <label className="mb-2 block text-sm font-bold text-[#4f252a]">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border bg-white px-5 py-3 pr-14 outline-none focus:ring-2 focus:ring-[#f1745e]/30"
                  style={{ borderColor: "rgba(79,37,42,0.14)" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7d5953]"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-black text-white shadow-md transition disabled:opacity-60"
                style={{ backgroundColor: "#f1745e" }}
              >
                <UserPlus size={18} />
                {loading ? "Creating..." : "Create Account"}
              </button>

              <Link
                href="/login"
                className="rounded-full border px-8 py-4 text-sm font-black text-[#4f252a]"
                style={{ borderColor: "rgba(79,37,42,0.14)", backgroundColor: "rgba(255,250,244,0.78)" }}
              >
                Already have an account?
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
