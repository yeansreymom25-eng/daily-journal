"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert(
      `Login clicked\nEmail: ${email}\nPassword: ${"*".repeat(password.length)}`
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fbe3b9] via-[#edd0ac] to-[#fbe3b9]" />

      {/* ✅ TOP BAR (Auth = No Logout) */}
      <header className="relative w-full bg-[#4f252a] border-b border-[#3a1b1f] shadow-md">
        <div className="w-full px-10 py-5 flex items-center justify-between">
          {/* Left: Brand (simple) */}
          <Link href="/" className="text-white font-bold text-xl tracking-wide">
            Daily Journal
          </Link>

          {/* Right: Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="bg-white/10 hover:bg-white/15 text-white text-sm px-5 py-2 rounded-lg font-semibold transition"
            >
              Back to Home
            </Link>

            <Link
              href="/signup"
              className="bg-[#e06464] hover:bg-[#f1745e] text-white text-sm px-6 py-2 rounded-lg font-semibold shadow-sm transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* ✅ BODY */}
      <main className="relative flex-1 flex">
        {/* ✅ LEFT PANEL (Correct Auth Sidebar) */}
        <aside className="w-[460px] bg-[#fbe3b9] border-r border-[#e6c9a4] px-10 py-12 flex flex-col">
          {/* Logo + Title */}
          <div className="flex flex-col items-start">
            <img
              src="/images/journal.png"
              alt="Daily Journal"
              className="w-[130px] h-auto"
            />
            <h2 className="mt-6 text-4xl font-extrabold text-[#4f252a]">
              Welcome back
            </h2>
            <p className="mt-3 text-[#4f252a]/80 text-lg leading-relaxed">
              Log in to continue writing, saving drafts, and tracking your mood.
            </p>
          </div>

          {/* Benefits cards */}
          <div className="mt-10 space-y-4">
            <div className="rounded-2xl border border-black/10 bg-white/55 px-6 py-5">
              <div className="flex items-center gap-3 text-[#4f252a] font-bold text-lg">
                <span className="text-xl">🔒</span> Private & secure
              </div>
              <p className="mt-2 text-[#4f252a]/75 text-sm">
                Your entries stay safe and personal.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/55 px-6 py-5">
              <div className="flex items-center gap-3 text-[#4f252a] font-bold text-lg">
                <span className="text-xl">📝</span> Draft anytime
              </div>
              <p className="mt-2 text-[#4f252a]/75 text-sm">
                Save unfinished thoughts and come back later.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/55 px-6 py-5">
              <div className="flex items-center gap-3 text-[#4f252a] font-bold text-lg">
                <span className="text-xl">📱</span> Sync across devices
              </div>
              <p className="mt-2 text-[#4f252a]/75 text-sm">
                Use it anywhere—phone, tablet, or laptop.
              </p>
            </div>
          </div>

          {/* Bottom image */}
          <div className="mt-auto pt-10">
            <img
              src="/images/book-flower.png"
              alt="Book with flowers"
              className="w-[380px] h-auto"
            />
          </div>
        </aside>

        {/* ✅ RIGHT SIDE (Form) */}
        <section className="flex-1 relative overflow-hidden">
          {/* Soft blobs */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#edd0ac] via-[#fbe3b9] to-[#edd0ac]" />
          <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-[#e06464]/25 blur-3xl" />
          <div className="absolute -bottom-28 left-28 h-80 w-80 rounded-full bg-[#f1745e]/20 blur-3xl" />

          <div className="relative h-full flex items-center justify-center px-12 py-12">
            <div className="w-full max-w-[720px]">
              <h1 className="text-6xl font-extrabold text-[#4f252a] text-center mb-10">
                Log In
              </h1>

              <div className="bg-white/90 backdrop-blur border border-black/10 rounded-3xl p-12 shadow-xl">
                <p className="text-center text-[#4f252a]/70 mb-10 text-lg">
                  Please enter your login details below
                </p>

                <form onSubmit={onSubmit} className="space-y-7">
                  {/* Email */}
                  <div>
                    <label className="block text-base font-bold mb-3 text-[#4f252a]">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-black/15 rounded-2xl px-6 py-4 text-lg outline-none
                                 focus:ring-2 focus:ring-[#e06464]/30 bg-white"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-base font-bold mb-3 text-[#4f252a]">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-black/15 rounded-2xl px-6 py-4 text-lg outline-none
                                 focus:ring-2 focus:ring-[#e06464]/30 bg-white"
                      required
                    />
                  </div>

                  {/* Forgot */}
                  <div className="text-base">
                    <Link
                      href="/forgot-password"
                      className="text-[#4f252a] underline font-semibold hover:text-[#e06464] transition"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Button */}
                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      className="px-24 py-4 rounded-2xl text-lg font-extrabold text-white
                                 bg-gradient-to-r from-[#e06464] to-[#f1745e]
                                 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
                    >
                      Log In
                    </button>
                  </div>

                  {/* Sign up */}
                  <p className="text-center text-base text-[#4f252a]/70 pt-2">
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
            </div>
          </div>
        </section>
      </main>

      {/* ✅ FOOTER */}
      <footer className="relative w-full bg-[#4f252a] border-t border-[#3a1b1f]">
        <div className="w-full px-10 py-5 flex items-center justify-center gap-16 text-sm font-medium text-white">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛡️</span> Secure Data
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">💗</span> Free to use
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📱</span> Sync across devices
          </div>
        </div>
      </footer>
    </div>
  );
}
