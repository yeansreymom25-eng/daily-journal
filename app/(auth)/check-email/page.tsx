"use client";

import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#fbe3b9] via-[#edd0ac] to-[#fbe3b9]" />

      <header className="relative w-full bg-[#4f252a] border-b border-[#3a1b1f] shadow-md">
        <div className="w-full px-4 sm:px-6 md:px-10 py-5 flex items-center justify-between">
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

      <main className="relative flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-[620px]">
          <div className="bg-white/80 backdrop-blur border border-black/15 rounded-2xl shadow-xl px-6 sm:px-10 py-10 text-center">
            <div className="flex justify-center mb-5">
              <img
                src="/images/check-email.png"
                alt="Check Email"
                className="w-[110px] sm:w-[120px] h-auto"
              />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#4f252a] mb-4">
              Check your email
            </h1>

            <p className="text-[#4f252a]/80 text-base leading-relaxed max-w-[460px] mx-auto mb-8">
              We sent a password reset link.
              <br />
              Open the email and click the link.
              <br />
              If you don’t see it, check spam.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center justify-center px-10 sm:px-12 py-4 rounded-xl text-white font-extrabold bg-[#e06464] hover:bg-[#f1745e] transition shadow-sm"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative w-full bg-[#4f252a] border-t border-[#3a1b1f]">
        <div className="w-full px-4 sm:px-6 md:px-10 py-5 flex items-center justify-center gap-6 sm:gap-10 md:gap-16 text-xs sm:text-sm font-medium text-white">
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