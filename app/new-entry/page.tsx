"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEntryPage() {
  const router = useRouter();

  const COLORS = {
    bg: "#edd0ac",
    top: "#4f252a",
    primary: "#f1745e",
    text: "#4f252a",
    cardBorder: "rgba(79,37,42,0.25)",
  };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");

  const emojis = useMemo(
    () => [
      "😀","😊","🥹","😍","😎","🤩","😴","😵","😮","😳",
      "🥲","😡","😭","😇","🤯","😌","🤔","😬","😐","🫶",
      "💪","🙏","🔥","🌸","✨","🌈","⭐","💡","📚","🎯",
      "🎵","🍀","☕","🍓","🌻","🌙","💖","✅",
    ],
    []
  );

  function onSave() {
    alert("Saved (UI only)");
    router.push("/dashboard");
  }

  function onSaveDraft() {
    alert("Saved as Draft (UI only)");
    router.push("/drafts");
  }

  return (
    <div
      className="h-screen overflow-hidden flex flex-col relative"
      style={{ background: COLORS.bg }}
    >
      {/* ===================== TOP BAR ===================== */}
      <header
        className="w-full border-b shadow-md flex-shrink-0"
        style={{ background: COLORS.top }}
      >
        <div className="w-full px-10 py-3 flex justify-end">
          <button
            onClick={() => alert("Logout (UI only)")}
            className="text-white font-bold px-6 py-2 rounded-xl text-base transition"
            style={{ background: COLORS.primary }}
          >
            Log Out
          </button>
        </div>
      </header>

      {/* ===================== CONTENT ===================== */}
      <main className="flex-1 flex justify-center items-start px-8 py-6 relative">
        <div className="w-full max-w-[1100px] relative">
          
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="text-2xl font-extrabold mb-3 flex items-center gap-2"
            style={{ color: COLORS.text }}
          >
            ← Back
          </button>

          {/* ===================== WHITE CARD ===================== */}
          <div
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
            style={{ border: `1.5px solid ${COLORS.cardBorder}` }}
          >
            {/* Title */}
            <div className="px-10 py-4 border-b flex items-center gap-4">
              <span className="text-3xl">🏷️</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full text-2xl font-bold outline-none"
                style={{ color: COLORS.text }}
              />
            </div>

            {/* Emoji Grid */}
            <div className="px-10 py-4 border-b">
              <div className="flex flex-wrap gap-3">
                {emojis.map((em) => {
                  const active = selectedEmoji === em;
                  return (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setSelectedEmoji(em)}
                      className="text-2xl rounded-xl px-4 py-2 transition border shadow-sm"
                      style={{
                        borderColor: active
                          ? COLORS.primary
                          : "rgba(79,37,42,0.15)",
                        background: active
                          ? "rgba(241,116,94,0.15)"
                          : "white",
                      }}
                    >
                      {em}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Textarea */}
            <div className="px-10 py-5">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing here..."
                className="w-full h-[240px] text-lg outline-none resize-none"
                style={{ color: "#333" }}
              />
            </div>
          </div>

          {/* CLOCK */}
            <img
              src="/images/clock.png"
              alt="Clock"
              className="absolute right-[-160px] top-[5px] w-[270px] h-auto select-none pointer-events-none"
              draggable={false}
            />

          {/* BUTTONS  */}
          <div className="flex justify-center gap-10 mt-6">
            <button
              onClick={onSave}
              className="px-16 py-4 rounded-2xl font-extrabold text-lg transition shadow-md"
              style={{
                background: COLORS.primary,
                color: "white",
              }}
            >
              Save
            </button>

            <button
              onClick={onSaveDraft}
              className="px-14 py-4 rounded-2xl font-extrabold text-lg transition shadow-md"
              style={{
                background: "#d9d9d9",
                color: "#111",
              }}
            >
              Save as Draft
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}