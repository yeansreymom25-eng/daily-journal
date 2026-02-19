"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Tab = "recent" | "drafts";

type Entry = {
  id: string;
  title: string;
  preview: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("recent");

  const COLORS = {
    bg: "#edd0ac",
    top: "#4f252a",
    primary: "#f1745e",
    primaryHover: "#e06464",
    side: "#fbf3b9",
    text: "#4f252a",
  };

  const entries: Entry[] = useMemo(
    () => [
      { id: "1", title: "A Good Day 🫶", preview: "Today was a great day, I went to..." },
      { id: "2", title: "Study Progress 🥹", preview: "Today I studied and I feel..." },
      { id: "3", title: "My Bad Day 🥲", preview: "It was not easy today because..." },
    ],
    []
  );

  const hoverPrimary = (e: React.MouseEvent<HTMLButtonElement>, on: boolean) => {
    e.currentTarget.style.backgroundColor = on ? COLORS.primaryHover : COLORS.primary;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.bg }}>
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
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = COLORS.primaryHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = COLORS.primary)
            }
            onClick={() => alert("Profile (UI only)")}
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
          style={{ backgroundColor: COLORS.side, borderColor: "rgba(79,37,42,0.3)" }}
        >
          <div
            className="h-[240px] border-b flex flex-col items-center justify-center gap-4"
            style={{ borderColor: "rgba(79,37,42,0.3)" }}
          >
            <img src="/images/journal.png" alt="My Journal" className="w-[150px]" />
            <div className="text-4xl font-extrabold" style={{ color: COLORS.text }}>
              My Journal
            </div>
          </div>

          <div className="flex-1 px-6 py-6 space-y-3">
            <button
              className="w-full flex items-center gap-4 px-5 py-4 rounded-lg text-white font-bold"
              style={{ backgroundColor: COLORS.primary }}
              onClick={() => router.push("/dashboard")}
            >
              <img src="/images/dashboard.png" alt="Dashboard" className="w-7" />
              Dashboard
            </button>

            <button
              className="w-full flex items-center gap-4 px-5 py-4 rounded-lg font-bold transition"
              style={{ color: COLORS.text }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(237,208,172,0.4)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              onClick={() => router.push("/drafts")}
            >
              <img src="/images/drafts.png" alt="Drafts" className="w-7" />
              Drafts
            </button>

            <button
              onClick={() => router.push("/settings")}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-lg font-bold transition"
              style={{ color: COLORS.text }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(237,208,172,0.4)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              ⚙️ Setting
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <section className="flex-1 p-10">
          <div className="flex items-center justify-between">
            <h1 className="text-6xl font-extrabold" style={{ color: COLORS.text }}>
              My Journal
            </h1>

            <div
              className="flex rounded-lg overflow-hidden border"
              style={{ borderColor: "rgba(79,37,42,0.3)" }}
            >
              <button
                onClick={() => setTab("recent")}
                className="px-8 py-3 font-bold"
                style={{
                  backgroundColor: tab === "recent" ? COLORS.primary : COLORS.side,
                  color: tab === "recent" ? "white" : COLORS.text,
                }}
              >
                Recent
              </button>

              <button
                onClick={() => setTab("drafts")}
                className="px-8 py-3 font-bold"
                style={{
                  backgroundColor: tab === "drafts" ? COLORS.primary : COLORS.side,
                  color: tab === "drafts" ? "white" : COLORS.text,
                }}
              >
                Drafts 2
              </button>
            </div>
          </div>

          <div
            className="mt-8 bg-white rounded-xl border overflow-hidden"
            style={{ borderColor: "rgba(79,37,42,0.25)" }}
          >
            {entries.map((e) => (
              <div
                key={e.id}
                onClick={() => router.push(`/entry/${e.id}`)}
                className="px-8 py-6 border-b flex items-center justify-between transition cursor-pointer"
                style={{ borderColor: "rgba(79,37,42,0.10)" }}
                onMouseEnter={(ev) =>
                  (ev.currentTarget.style.backgroundColor = "rgba(251,243,185,0.40)")
                }
                onMouseLeave={(ev) => (ev.currentTarget.style.backgroundColor = "transparent")}
              >
                <div>
                  <div className="text-3xl font-extrabold text-[#1b1b1b]">{e.title}</div>
                  <div className="text-gray-500 text-lg mt-1">{e.preview}</div>
                </div>

                {/* Buttons MUST stop propagation so row click still works */}
                <div className="flex gap-5 text-2xl">
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      alert("Edit (UI only)");
                    }}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      alert("Delete (UI only)");
                    }}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
