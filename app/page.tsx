import Link from "next/link";
import { ArrowRight, BookOpen, Lock, Sparkles } from "lucide-react";

export default function WelcomePage() {
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
        <nav className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Daily Journal</p>
            <h1 className="mt-1 text-xl font-black text-white sm:text-2xl">A home for your reflections</h1>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap lg:w-auto lg:justify-end">
            <Link
              href="/login"
              className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-white/15"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full px-5 py-3 text-center text-sm font-bold text-white transition hover:-translate-y-0.5"
              style={{ backgroundColor: "#f1745e" }}
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto grid max-w-[1440px] gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8 lg:px-10">
        <section
          className="rounded-[28px] border p-6 shadow-[0_28px_70px_rgba(79,37,42,0.10)] sm:rounded-[36px] sm:p-8 lg:p-12"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,250,244,0.96) 0%, rgba(251,243,185,0.86) 100%)",
            borderColor: "rgba(79,37,42,0.14)",
          }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7d5953]">Welcome</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-[#4f252a] sm:text-4xl lg:text-7xl">
            Write slowly, remember deeply, and keep every thought close.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#7d5953] sm:mt-6 sm:text-lg sm:leading-8">
            Daily Journal gives you one calm space for reflections, moods, unfinished drafts, and the
            moments you want to revisit later.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-black text-white shadow-md transition hover:-translate-y-0.5"
              style={{ backgroundColor: "#f1745e" }}
            >
              Get Started
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/login"
              className="rounded-full border px-6 py-4 text-center text-base font-black text-[#4f252a] transition"
              style={{ backgroundColor: "#fffaf4", borderColor: "rgba(79,37,42,0.14)" }}
            >
              Continue Writing
            </Link>
          </div>
        </section>

        <aside className="space-y-5">
          <div
            className="rounded-[28px] border p-5 shadow-[0_24px_60px_rgba(79,37,42,0.08)] sm:rounded-[32px] sm:p-6"
            style={{ backgroundColor: "#f9efbc", borderColor: "rgba(79,37,42,0.14)" }}
          >
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "#4f252a" }}
            >
              <BookOpen size={28} color="#fff" />
            </div>
            <h3 className="mt-5 text-xl font-black text-[#4f252a] sm:text-2xl">Built for daily writing</h3>
            <p className="mt-3 text-sm leading-7 text-[#7d5953]">
              Capture quick thoughts, shape longer entries, and return to drafts whenever inspiration
              comes back.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div
              className="rounded-[24px] border p-5 sm:rounded-[28px]"
              style={{ backgroundColor: "#fffaf4", borderColor: "rgba(79,37,42,0.14)" }}
            >
              <Lock size={22} color="#f1745e" />
              <h4 className="mt-4 text-xl font-black text-[#4f252a]">Private by default</h4>
              <p className="mt-2 text-sm leading-6 text-[#7d5953]">Your personal writing stays in one secure place.</p>
            </div>

            <div
              className="rounded-[24px] border p-5 sm:rounded-[28px]"
              style={{ backgroundColor: "#fffaf4", borderColor: "rgba(79,37,42,0.14)" }}
            >
              <Sparkles size={22} color="#f1745e" />
              <h4 className="mt-4 text-xl font-black text-[#4f252a]">Thoughtful and calm</h4>
              <p className="mt-2 text-sm leading-6 text-[#7d5953]">A softer workspace that keeps focus on the writing itself.</p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
