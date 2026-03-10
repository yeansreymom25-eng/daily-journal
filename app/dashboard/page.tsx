"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser, signOutUser } from "@/lib/auth";
import { getDrafts, getEntries, type JournalDraft, type JournalEntry } from "@/lib/journal";

type Tab = "recent" | "drafts";

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("recent");
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [drafts, setDrafts] = useState<JournalDraft[]>([]);
  const [loading, setLoading] = useState(true);

  const COLORS = {
    bg: "#edd0ac",
    top: "#4f252a",
    primary: "#f1745e",
    primaryHover: "#e06464",
    side: "#fbf3b9",
    text: "#4f252a",
  };

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);

      try {
        const [entriesData, draftsData] = await Promise.all([
          getEntries(),
          getDrafts(),
        ]);

        setEntries(entriesData);
        setDrafts(draftsData);
      } catch (error: any) {
        alert(error.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const currentList = useMemo(() => {
    if (tab === "recent") return entries;
    return drafts;
  }, [tab, entries, drafts]);

  const hoverPrimary = (e: React.MouseEvent<HTMLButtonElement>, on: boolean) => {
    e.currentTarget.style.backgroundColor = on ? COLORS.primaryHover : COLORS.primary;
  };

  async function handleLogout() {
    try {
      await signOutUser();
      router.push("/login");
    } catch (error: any) {
      alert(error.message || "Logout failed.");
    }
  }

  async function handleDeleteEntry(id: string) {
    const confirmed = window.confirm("Delete this journal entry?");
    if (!confirmed) return;

    try {
      const { deleteEntry } = await import("@/lib/journal");
      await deleteEntry(id);
      setEntries((prev) => prev.filter((item) => item.id !== id));
    } catch (error: any) {
      alert(error.message || "Failed to delete entry.");
    }
  }

  async function handleDeleteDraft(id: string) {
    const confirmed = window.confirm("Delete this draft?");
    if (!confirmed) return;

    try {
      const { deleteDraft } = await import("@/lib/journal");
      await deleteDraft(id);
      setDrafts((prev) => prev.filter((item) => item.id !== id));
    } catch (error: any) {
      alert(error.message || "Failed to delete draft.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.bg }}>
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
            onClick={handleLogout}
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
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.primary;
            }}
            onClick={() => router.push("/settings")}
            title={user?.email ?? "Profile"}
          >
            👤
          </button>
        </div>
      </header>

      <main className="flex-1 flex">
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
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(237,208,172,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              onClick={() => router.push("/drafts")}
            >
              <img src="/images/drafts.png" alt="Drafts" className="w-7" />
              Drafts
            </button>

            <button
              onClick={() => router.push("/settings")}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-lg font-bold transition"
              style={{ color: COLORS.text }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(237,208,172,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              ⚙️ Setting
            </button>
          </div>
        </aside>

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
                Drafts {drafts.length}
              </button>
            </div>
          </div>

          <div
            className="mt-8 bg-white rounded-xl border overflow-hidden"
            style={{ borderColor: "rgba(79,37,42,0.25)" }}
          >
            {currentList.length === 0 ? (
              <div className="px-8 py-10 text-xl" style={{ color: COLORS.text }}>
                {tab === "recent" ? "No journal entries yet." : "No drafts yet."}
              </div>
            ) : (
              currentList.map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    router.push(tab === "recent" ? `/entry/${item.id}` : `/drafts/${item.id}`)
                  }
                  className="px-8 py-6 border-b flex items-center justify-between transition cursor-pointer"
                  style={{ borderColor: "rgba(79,37,42,0.10)" }}
                  onMouseEnter={(ev) => {
                    ev.currentTarget.style.backgroundColor = "rgba(251,243,185,0.40)";
                  }}
                  onMouseLeave={(ev) => {
                    ev.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div>
                    <div className="text-3xl font-extrabold text-[#1b1b1b]">
                      {item.title || (tab === "recent" ? "Untitled Entry" : "Untitled Draft")}{" "}
                      {item.mood}
                    </div>
                    <div className="text-gray-500 text-lg mt-1">
                      {item.content ? `${item.content.slice(0, 80)}...` : "No content yet."}
                    </div>
                  </div>

                  <div className="flex gap-5 text-2xl">
                    {tab === "recent" ? (
                      <>
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            router.push(`/entry/${item.id}/edit`);
                          }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            handleDeleteEntry(item.id);
                          }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            router.push(`/drafts/${item.id}`);
                          }}
                          title="Edit Draft"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            handleDeleteDraft(item.id);
                          }}
                          title="Delete Draft"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}