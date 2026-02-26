"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Draft = {
  id: string;
  title: string;
  date: string;
  mood: string;
  content: string;
};

export default function DraftDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id || "1");

  // ✅ SAME PALETTE (keep consistent)
  const COLORS = {
    bg: "#edd0ac",
    top: "#4f252a",
    text: "#4f252a",
    primary: "#f1745e",
    primaryHover: "#e06464",
    border: "rgba(79,37,42,0.22)",
    card: "rgba(255,255,255,0.65)",
    softWhite: "rgba(255,255,255,0.55)",
  };

  // Demo drafts (UI only)
  const drafts: Draft[] = useMemo(
    () => [
      {
        id: "1",
        title: "Draft: Study plan",
        date: "February 19, 2026",
        mood: "✨",
        content: "Start writing your draft...",
      },
      {
        id: "2",
        title: "Draft: My feelings",
        date: "February 19, 2026",
        mood: "💭",
        content: "I feel a bit tired but...",
      },
      {
        id: "3",
        title: "Draft: Goals",
        date: "February 19, 2026",
        mood: "🎯",
        content: "This month I want to improve...",
      },
    ],
    []
  );

  const isNew = id === "new";
  const current = drafts.find((d) => d.id === id) || drafts[0];

  // ✅ editable
  const [title, setTitle] = useState<string>(
    isNew ? "Draft: New idea" : current.title
  );
  const [content, setContent] = useState<string>(isNew ? "" : current.content);

  const hoverPrimary = (e: React.MouseEvent<HTMLButtonElement>, on: boolean) => {
    e.currentTarget.style.backgroundColor = on
      ? COLORS.primaryHover
      : COLORS.primary;
  };

  const saveUIOnly = () => {
    alert("Saved (UI only). Backend later with Supabase ✅");
  };

  const saveAsDraftUIOnly = () => {
    alert("Saved as Draft (UI only). Backend later with Supabase ✅");
  };

  const deleteUIOnly = () => {
    alert("Deleted (UI only). Backend later with Supabase ✅");
    router.push("/drafts");
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: COLORS.bg }}
    >
      {/* TOP BAR */}
      <header className="w-full shrink-0" style={{ backgroundColor: COLORS.top }}>
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
      <main className="flex-1 overflow-hidden px-10 pt-10 pb-8">
        <div className="mx-auto w-full max-w-6xl h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between shrink-0">
            <div className="flex items-start gap-6">
              <button
                onClick={() => router.push("/drafts")}
                className="text-6xl font-bold leading-none mt-2"
                style={{ color: COLORS.text }}
              >
                ←
              </button>

              <div>
                <div className="flex items-center gap-4">
                  <h1
                    className="text-6xl font-extrabold"
                    style={{ color: COLORS.text }}
                  >
                    {title}
                  </h1>
                  <span className="text-5xl">{isNew ? "✨" : current.mood}</span>
                </div>

                <div
                  className="mt-3 text-3xl"
                  style={{ color: "rgba(79,37,42,0.55)" }}
                >
                  {isNew ? "February 19, 2026" : current.date}
                </div>
              </div>
            </div>

            <div className="text-4xl mt-3" style={{ color: COLORS.text }}>
              📝
            </div>
          </div>

          {/* Content Row */}
          <div className="mt-10 flex gap-12 items-start flex-1 overflow-hidden">
            {/* LEFT COLUMN (textarea + buttons) */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Text box */}
              <div
                className="rounded-2xl border"
                style={{
                  backgroundColor: COLORS.card,
                  borderColor: COLORS.border,
                  boxShadow: "0 18px 35px rgba(79,37,42,0.18)",
                  overflow: "hidden",
                }}
              >
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your draft..."
                  className="w-full h-[260px] p-10 text-3xl leading-relaxed outline-none resize-none"
                  style={{
                    backgroundColor: "transparent",
                    color: COLORS.text,
                  }}
                />
              </div>

              {/* ✅ Buttons moved UP (directly under textarea) */}
              <div className="mt-7 flex items-center gap-6">
                <button
                  onClick={saveUIOnly}
                  className="px-12 py-4 rounded-xl text-xl font-bold text-white transition shadow-md"
                  style={{ backgroundColor: COLORS.primary }}
                  onMouseEnter={(e) => hoverPrimary(e, true)}
                  onMouseLeave={(e) => hoverPrimary(e, false)}
                >
                  Save
                </button>

                <button
                  onClick={saveAsDraftUIOnly}
                  className="px-12 py-4 rounded-xl text-xl font-bold border transition shadow-sm"
                  style={{
                    backgroundColor: COLORS.softWhite,
                    borderColor: COLORS.border,
                    color: COLORS.text,
                  }}
                >
                  Save as Draft
                </button>

                <button
                  onClick={deleteUIOnly}
                  className="px-12 py-4 rounded-xl text-xl font-bold border transition shadow-sm"
                  style={{
                    backgroundColor: COLORS.softWhite,
                    borderColor: COLORS.border,
                    color: "#cc1f1f",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN (coffee image) */}
            <div className="w-[420px] relative flex items-start justify-center">
              <img
                src="/images/coffee.png"
                alt="Coffee"
                className="w-[420px] h-auto select-none"
                draggable={false}
                style={{
                  transform: "translateX(40px) translateY(40px)",
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}