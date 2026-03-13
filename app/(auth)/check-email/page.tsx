"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const isSignup = type === "signup";

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
            <h1 className="mt-1 text-2xl font-black text-white">Check your email</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-89px)] max-w-[900px] items-center px-6 py-12 lg:px-10">
        <div
          className="w-full rounded-[36px] border p-8 text-center shadow-[0_28px_70px_rgba(79,37,42,0.10)]"
          style={{ backgroundColor: "#fffaf4", borderColor: "rgba(79,37,42,0.14)" }}
        >
          <div className="mb-5 flex justify-center">
            <Image
              src="/images/check-email.png"
              alt="Check Email"
              width={120}
              height={120}
              className="w-[110px] sm:w-[120px] h-auto"
              priority
            />
          </div>

          <h2 className="text-4xl font-black text-[#4f252a]">Check your email</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#7d5953]">
            We sent a {isSignup ? "confirmation" : "password reset"} link to your email.
            <br />
            Open it to {isSignup ? "activate your account" : "update your password"}.
            <br />
            If you don&apos;t see it, check spam.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/login"
              className="rounded-full px-8 py-4 text-sm font-black text-white shadow-md transition"
              style={{ backgroundColor: "#f1745e" }}
            >
              Back to Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center font-bold text-xl"
          style={{
            background: "linear-gradient(180deg, #f7e8d0 0%, #ecd3b2 55%, #e5c5a0 100%)",
            color: "#4f252a",
          }}
        >
          Loading...
        </div>
      }
    >
      <CheckEmailContent />
    </Suspense>
  );
}
