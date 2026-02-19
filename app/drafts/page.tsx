"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

type Draft = {
  id: string;
  title: string;
  preview: string;
  date: string;
  mood: string;
};

const STORAGE_KEY = "myjournal_drafts_v1";

function readDraftsFromStorage(): Draft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeDraftsToStorage(drafts: Draft[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export default function DraftsPage() {
  const router = useRouter();

  // ✅ SAME PALETTE
  const COLORS = {
    bg: "#edd0ac",
    top: "#4f252a",
    primary: "#f1745e",
    primaryHover: "#e06464",
    side: "#fbf3b9",
    text: "#4f252a",
    border: "rgba(79,37,42,0.22)",
    card: "rgba(255,255,255,0.65)",
  };

  const seedDrafts: Draft[] = useMemo(
    () => [
      {
        id: "d1",
        title: "Draft: Study plan ✍️",
        preview: "Today I want to plan my week...",
        date: "February 20, 2026",
        mood: "📝",
      },
      {
        id: "d2",
        title: "Draft: My feelings ☁️",
        preview: "I feel a bit tired but...",
        date: "February 20, 2026",
        mood: "💭",
      },
      {
        id: "d3",
        title: "Draft: Goals 🎯",
        preview: "This month I want to improve...",
        date: "February 20, 2026",
        mood: "🔥",
      },
    ],
    []
  );

  const hoverPrimary = (e: React.MouseEvent<HTMLButtonElement>, on: boolean) => {
    e.currentTarget.style.backgroundColor = on
      ? COLORS.primaryHover
      : COLORS.primary;
  };

  const createNewDraft = () => {
    // UI only: create a new draft + store in localStorage, then go detail page
    const newId = `d_${Date.now()}`;
    const newDraft: Draft = {
      id: newId,
      title: "Draft: New idea ✨",
      preview: "Start writing your draft...",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      mood: "📝",
    };

    const existing = readDraftsFromStorage();
    const merged =
      existing.length > 0 ? [newDraft, ...existing] : [newDraft, ...seedDrafts];

    writeDraftsToStorage(merged);
    router.push(`/drafts/${newId}`);
  };

  // ✅ Load from storage if exists, else show seed list
  const drafts = (() => {
    if (typeof window === "undefined") return seedDrafts;
    const stored = readDraftsFromStorage();
    return stored.length > 0 ? stored : seedDrafts;
  })();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: COLORS.bg }}
    >
      {/* TOP BAR */}
      <header
        className="w-full border-b shadow-md"
        style={{ backgroundColor: COLORS.top, borderColor: "#3a1b1f" }}
      >
        <div className="w-full px-8 py-4 flex items-center justify-end gap-4">
          <button
            onClick={() => router.push("/new-entry")}
            className="text-white font-bold px-5 py-2 rounded-lg transition"
            style={{ backgroundColor: COLORS.primary }}
            onMouseEnter={(e) => hoverPrimary(e, true)}
            onMouseLeave={(e) => hoverPrimary(e, false)}
          >
            + New Entry
          </button>

          <button
            onClick={() => alert("Logout (UI only)")}
            className="text-white font-bold px-5 py-2 rounded-lg transition"
            style={{ backgroundColor: COLORS.primary }}
            onMouseEnter={(e) => hoverPrimary(e, true)}
            onMouseLeave={(e) => hoverPrimary(e, false)}
          >
            Log Out
          </button>

          <button
            className="h-9 w-9 rounded-md flex items-center justify-center text-white"
            style={{ backgroundColor: COLORS.primary }}
            onMouseEnter={(e) => hoverPrimary(e as any, true)}
            onMouseLeave={(e) => hoverPrimary(e as any, false)}
            title="Profile (UI)"
          >
            👤
          </button>
        </div>
      </header>

      {/* BODY */}
      <main className="flex-1 flex">
        {/* SIDEBAR */}
        <aside
          className="w-[340px] border-r flex flex-col"
          style={{
            backgroundColor: COLORS.side,
            borderColor: "rgba(79,37,42,0.3)",
          }}
        >
          <div
            className="h-[240px] border-b flex flex-col items-center justify-center gap-4"
            style={{ borderColor: "rgba(79,37,42,0.3)" }}
          >
            <img
              src="/images/journal.png"
              alt="My Journal"
              className="w-[150px]"
            />
            <div
              className="text-4xl font-extrabold"
              style={{ color: COLORS.text }}
            >
              My Journal
            </div>
          </div>

          <div className="flex-1 px-6 py-6 space-y-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-lg font-bold transition"
              style={{ color: COLORS.text }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(237,208,172,0.4)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <img src="/images/dashboard.png" alt="Dashboard" className="w-7" />
              Dashboard
            </button>

            {/* ACTIVE: Drafts */}
            <button
              className="w-full flex items-center gap-4 px-5 py-4 rounded-lg text-white font-bold"
              style={{ backgroundColor: COLORS.primary }}
            >
              <img src="/images/drafts.png" alt="Drafts" className="w-7" />
              Drafts
            </button>

            <button
              onClick={() => router.push("/settings")}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-lg font-bold transition"
              style={{ color: COLORS.text }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(237,208,172,0.4)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              ⚙️ Setting
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <section className="flex-1 p-10">
          <div className="flex items-center justify-between">
            <h1
              className="text-6xl font-extrabold"
              style={{ color: COLORS.text }}
            >
              Drafts
            </h1>

            <button
              onClick={createNewDraft}
              className="px-6 py-3 font-bold text-white rounded-lg transition"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => hoverPrimary(e, true)}
              onMouseLeave={(e) => hoverPrimary(e, false)}
            >
              + New Draft
            </button>
          </div>

          <div
            className="mt-8 rounded-xl border overflow-hidden"
            style={{
              backgroundColor: COLORS.card,
              borderColor: COLORS.border,
              boxShadow: "0 18px 35px rgba(79,37,42,0.18)",
            }}
          >
            {drafts.map((d) => (
              <div
                key={d.id}
                onClick={() => router.push(`/drafts/${d.id}`)}
                className="cursor-pointer px-8 py-6 border-b flex items-center justify-between transition"
                style={{ borderColor: "rgba(79,37,42,0.10)" }}
                onMouseEnter={(ev) =>
                  (ev.currentTarget.style.backgroundColor =
                    "rgba(251,243,185,0.40)")
                }
                onMouseLeave={(ev) =>
                  (ev.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <div>
                  <div className="text-3xl font-extrabold text-[#1b1b1b]">
                    {d.title} <span className="text-2xl">{d.mood}</span>
                  </div>
                  <div className="text-gray-600 text-lg mt-1">{d.preview}</div>
                </div>

                {/* icons (UI) */}
                <div className="flex gap-5 text-2xl opacity-80">
                  ✏️ 🗑️
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
