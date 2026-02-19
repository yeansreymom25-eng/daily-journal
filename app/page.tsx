import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fbe3b9] via-[#edd0ac] to-[#fbe3b9]" />

      {/* 🔥 DARK TOP BAR */}
      <header className="relative w-full bg-[#4f252a] border-b border-[#3a1b1f] shadow-md">
        <nav className="mx-auto max-w-6xl px-10 py-6 flex items-center justify-end">

          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30
                         text-white font-semibold transition"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="px-6 py-3 rounded-xl bg-[#e06464] hover:bg-[#f1745e]
                         text-white font-semibold shadow-md transition"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* MAIN */}
      <main className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-14">
        <img
          src="/images/journal.png"
          alt="Daily Journal"
          className="w-[300px] h-auto mb-8"
        />

        <p className="text-lg text-[#4f252a]/80">Welcome to</p>

        <h1 className="text-6xl sm:text-7xl font-extrabold text-[#4f252a] mt-3">
          Daily Journal
        </h1>

        <p className="text-[#4f252a]/80 mt-6 text-2xl max-w-2xl">
          Write your thoughts and track your mood every day.
        </p>

        <Link
          href="/signup"
          className="mt-12 inline-flex items-center justify-center gap-2 
                     px-16 py-6 rounded-3xl 
                     bg-gradient-to-r from-[#e06464] to-[#f1745e]
                     text-white text-xl font-bold 
                     shadow-lg hover:-translate-y-1 transition"
        >
          Get Started →
        </Link>
      </main>

      {/* 🔥 DARK FOOTER */}
      <footer className="relative w-full bg-[#4f252a] border-t border-[#3a1b1f]">
        <div className="mx-auto max-w-6xl px-10 py-6 flex items-center justify-center gap-20 text-lg font-medium text-white">

          <div className="flex items-center gap-3">
            🔒 <span>Secure Data</span>
          </div>

          <div className="flex items-center gap-3">
            💗 <span>Free to use</span>
          </div>

          <div className="flex items-center gap-3">
            🔄 <span>Sync across devices</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
