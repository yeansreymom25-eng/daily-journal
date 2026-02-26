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

  // ✅ UUID checker (prevents "d1" crash)
  const isUUID = (v: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      v
    );

  // UI-only demo drafts (use simple ids like "1", "2", "3")
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

  // ✅ If id is not UUID, we safely use UI demo draft
  const current = drafts.find((d) => d.id === id) || drafts[0];

  const [title, setTitle] = useState<string>(
    isNew ? "Draft: New idea" : current.title
  );
  const [content, setContent] = useState<string>(isNew ? "" : current.content);

  const hoverPrimary = (e: React.MouseEvent<HTMLButtonElement>, on: boolean) => {
    e.currentTarget.style.backgroundColor = on
      ? COLORS.primaryHover
      : COLORS.primary;
  };

  const saveUIOnly = () => alert("Saved (UI only). Backend later with Supabase ✅");
  const saveAsDraftUIOnly = () =>
    alert("Saved as Draft (UI only). Backend later with Supabase ✅");
  const deleteUIOnly = () => {
    alert("Deleted (UI only). Backend later with Supabase ✅");
    router.push("/drafts");
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: COLORS.bg }}>
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

      {/* BODY (fit in one screen) */}
      <main className="flex-1 overflow-hidden px-10 py-6">
        <div className="mx-auto w-full max-w-6xl h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between shrink-0">
            <div className="flex items-start gap-6">
              <button
                onClick={() => router.push("/drafts")}
                className="text-6xl font-bold leading-none mt-1"
                style={{ color: COLORS.text }}
              >
                ←
              </button>

              <div>
                <div className="flex items-center gap-4">
                  <h1
                    className="text-5xl font-extrabold"
                    style={{ color: COLORS.text }}
                  >
                    {title}
                  </h1>
                  <span className="text-5xl">{isNew ? "✨" : current.mood}</span>
                </div>

                <div
                  className="mt-2 text-2xl"
                  style={{ color: "rgba(79,37,42,0.55)" }}
                >
                  {isNew ? "February 19, 2026" : current.date}
                </div>

                {/* Optional: show info if id is UUID or not */}
                {/* <div className="mt-1 text-sm opacity-70" style={{ color: COLORS.text }}>
                  {isUUID(id) ? "UUID route (ready for DB)" : "UI demo route"}
                </div> */}
              </div>
            </div>

          </div>

          {/* Content Row */}
          <div className="mt-6 flex-1 flex gap-10 items-start overflow-hidden relative">
            {/* Text box */}
            <div
              className="flex-1 rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: COLORS.card,
                borderColor: COLORS.border,
                boxShadow: "0 18px 35px rgba(79,37,42,0.18)",
              }}
            >
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your draft..."
                className="w-full h-full p-8 text-2xl leading-relaxed outline-none resize-none"
                style={{
                  backgroundColor: "transparent",
                  color: COLORS.text,
                  minHeight: "360px",
                }}
              />
            </div>

            {/* Coffee image (move more right + keep visible) */}
            <div className="w-[360px] relative shrink-0">
              <img
                src="/images/coffee.png"
                alt="Coffee"
                draggable={false}
                style={{
                  position: "absolute",
                  right: "20px", // more to the right
                  top: "300px",
                  width: "560px",
                  height: "auto",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 shrink-0 flex items-center gap-8">
            <button
              onClick={saveUIOnly}
              className="px-14 py-4 rounded-xl text-2xl font-bold text-white transition"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => hoverPrimary(e, true)}
              onMouseLeave={(e) => hoverPrimary(e, false)}
            >
              Save
            </button>

            <button
              onClick={saveAsDraftUIOnly}
              className="px-14 py-4 rounded-xl text-2xl font-bold border transition"
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
              className="px-14 py-4 rounded-xl text-2xl font-bold border transition"
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
      </main>
    </div>
  );
}