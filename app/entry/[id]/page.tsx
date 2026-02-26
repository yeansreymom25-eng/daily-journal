"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

type Entry = {
  id: string;
  title: string;
  preview: string;
  date: string;
  mood: string;
  content: string;
};

export default function EntryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id || "1");

  const COLORS = {
    bg: "#edd0ac",
    top: "#4f252a",
    side: "#fbf3b9",
    text: "#4f252a",
    primary: "#f1745e",
    primaryHover: "#e06464",
    border: "rgba(79,37,42,0.22)",
    card: "rgba(255,255,255,0.65)",
  };

  const entries: Entry[] = useMemo(
    () => [
      {
        id: "1",
        title: "A Good Day",
        preview: "Today was a great day, I went to...",
        date: "February 20, 2026",
        mood: "🥰",
        content:
          "Today was a great day, I went to the beach with family, enjoy the sunset view, and a nice dinner. I feel very Happy.",
      },
      {
        id: "2",
        title: "Study Progress",
        preview: "Today I studied and I feel...",
        date: "February 20, 2026",
        mood: "🥹",
        content:
          "Today I studied and I feel proud. I will keep going step by step.",
      },
      {
        id: "3",
        title: "My Bad Day",
        preview: "It was not easy today because...",
        date: "February 20, 2026",
        mood: "🥲",
        content:
          "It was not easy today, but I learned something and I will try again tomorrow.",
      },
    ],
    []
  );

  const entry = entries.find((e) => e.id === id) || entries[0];

  const hoverPrimary = (
    e: React.MouseEvent<HTMLButtonElement>,
    on: boolean
  ) => {
    e.currentTarget.style.backgroundColor = on
      ? COLORS.primaryHover
      : COLORS.primary;
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: COLORS.bg }}
    >
      {/* TOP BAR */}
      <header className="w-full flex-shrink-0" style={{ backgroundColor: COLORS.top }}>
        <div className="w-full px-10 py-4 flex items-center justify-end">
          <button
            onClick={() => alert("Logout (UI only)")}
            className="text-white font-bold px-5 py-2 rounded-lg transition"
            style={{ backgroundColor: COLORS.primary }}
            onMouseEnter={(e) => hoverPrimary(e, true)}
            onMouseLeave={(e) => hoverPrimary(e, false)}
          >
            Log Out
          </button>
        </div>
      </header>

      {/* BODY */}
      <main className="flex-1 overflow-hidden px-10 py-6">
        <div className="mx-auto w-full max-w-6xl h-full flex flex-col">
          {/* Header Row */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-6xl font-bold leading-none"
                style={{ color: COLORS.text }}
              >
                ←
              </button>

              <div>
                <div className="flex items-center gap-4">
                  <h1 className="text-6xl font-extrabold" style={{ color: COLORS.text }}>
                    {entry.title}
                  </h1>
                  <span className="text-5xl">{entry.mood}</span>
                </div>

                <div
                  className="mt-2 text-3xl"
                  style={{ color: "rgba(79,37,42,0.55)" }}
                >
                  {entry.date}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Row */}
          <div className="mt-6 flex-1 flex gap-10 items-start overflow-hidden">
            {/* Big text box */}
            <div
              className="flex-1 rounded-2xl border p-10 h-full overflow-hidden"
              style={{
                backgroundColor: COLORS.card,
                borderColor: COLORS.border,
                boxShadow: "0 18px 35px rgba(79,37,42,0.18)",
              }}
            >
              <p className="text-3xl leading-relaxed" style={{ color: COLORS.text }}>
                {entry.content}
              </p>
            </div>

            {/* Image area (relative so absolute works correctly) */}
            <div className="w-[360px] relative h-full overflow-hidden">
              <img
                src="/images/coffee.png"
                alt="Coffee"
                className="absolute right-[-60px] top-[20px] w-[1000px] h-auto select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex items-center gap-10 flex-shrink-0">
            <button
              onClick={() => alert("Edit (UI only)")}
              className="px-16 py-5 rounded-xl text-3xl font-bold text-white transition"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => hoverPrimary(e, true)}
              onMouseLeave={(e) => hoverPrimary(e, false)}
            >
              Edit
            </button>

            <button
              onClick={() => alert("Delete (UI only)")}
              className="px-16 py-5 rounded-xl text-3xl font-bold border transition"
              style={{
                backgroundColor: "rgba(255,255,255,0.55)",
                borderColor: COLORS.border,
                color: "#cc1f1f",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}