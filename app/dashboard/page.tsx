"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  LogOut,
  PencilLine,
  Settings,
  Sparkles,
  Trash2,
  UserCircle2,
} from "lucide-react";
import { getAvatarUrl, getCurrentUser, signOutUser } from "@/lib/auth";
import { getDrafts, getEntries, type JournalDraft, type JournalEntry } from "@/lib/journal";

type Tab = "recent" | "drafts";
type DashboardItem = JournalEntry | JournalDraft;

const COLORS = {
  page: "#ecd3b2",
  panel: "#fffaf4",
  top: "#4f252a",
  topSoft: "#6f3b40",
  primary: "#f1745e",
  primaryHover: "#df624f",
  side: "#f9efbc",
  text: "#4f252a",
  textSoft: "#7d5953",
  border: "rgba(79,37,42,0.14)",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getPreview(content: string) {
  if (!content.trim()) return "No content yet.";
  return content.length > 120 ? `${content.slice(0, 120)}...` : content;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("recent");
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [drafts, setDrafts] = useState<JournalDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);

      try {
        const [entriesData, draftsData] = await Promise.all([getEntries(), getDrafts()]);
        setEntries(entriesData);
        setDrafts(draftsData);
      } catch (error: unknown) {
        setErrorMessage(getErrorMessage(error, "Failed to load dashboard."));
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

  const avatarUrl = useMemo(() => getAvatarUrl(user), [user]);

  const stats = useMemo(() => {
    const publishedThisMonth = entries.filter((entry) => {
      const created = new Date(entry.created_at);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;

    return [
      {
        label: "Published Entries",
        value: entries.length,
        note: `${publishedThisMonth} written this month`,
        icon: BookOpen,
      },
      {
        label: "Active Drafts",
        value: drafts.length,
        note: drafts.length > 0 ? "Ideas waiting for polish" : "Nothing waiting in draft",
        icon: FileText,
      },
      {
        label: "Latest Mood",
        value: entries[0]?.mood || drafts[0]?.mood || "Calm",
        note: "Pulled from your most recent writing",
        icon: Sparkles,
      },
    ];
  }, [entries, drafts]);

  async function handleLogout() {
    try {
      await signOutUser();
      router.push("/");
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Logout failed."));
    }
  }

  async function handleDeleteEntry(id: string) {
    try {
      const { deleteEntry } = await import("@/lib/journal");
      await deleteEntry(id);
      setEntries((prev) => prev.filter((item) => item.id !== id));
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Failed to delete entry."));
    }
  }

  async function handleDeleteDraft(id: string) {
    try {
      const { deleteDraft } = await import("@/lib/journal");
      await deleteDraft(id);
      setDrafts((prev) => prev.filter((item) => item.id !== id));
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Failed to delete draft."));
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(180deg, #f7e8d0 0%, #ecd3b2 55%, #e5c5a0 100%)",
        }}
      >
        <div className="h-24 animate-pulse rounded-b-[32px] bg-[#4f252a]" />
        <div className="mx-auto flex max-w-[1440px] gap-8 px-6 py-8 lg:px-10">
          <aside className="hidden w-[310px] rounded-[28px] bg-[#f9efbc] p-6 shadow-sm lg:block">
            <div className="mb-6 h-48 rounded-[24px] bg-black/5" />
            <div className="space-y-3">
              <div className="h-14 rounded-2xl bg-black/5" />
              <div className="h-14 rounded-2xl bg-black/5" />
              <div className="h-14 rounded-2xl bg-black/5" />
            </div>
          </aside>
          <main className="flex-1 space-y-6">
            <div className="h-44 rounded-[32px] bg-white/60 animate-pulse" />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="h-32 rounded-[28px] bg-white/60 animate-pulse" />
              <div className="h-32 rounded-[28px] bg-white/60 animate-pulse" />
              <div className="h-32 rounded-[28px] bg-white/60 animate-pulse" />
            </div>
            <div className="h-[420px] rounded-[32px] bg-white/60 animate-pulse" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #f7e8d0 0%, #ecd3b2 55%, #e5c5a0 100%)",
        color: COLORS.text,
      }}
    >
      <header
        className="relative overflow-hidden border-b px-6 py-5 shadow-sm lg:px-10"
        style={{ backgroundColor: COLORS.top, borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-1/3 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)" }}
        />
        <div className="relative mx-auto flex max-w-[1440px] items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Daily Journal</p>
            <h1 className="mt-1 text-2xl font-black text-white">A home for your reflections</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/new-entry")}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
              style={{ backgroundColor: COLORS.primary }}
            >
              <PencilLine size={18} />
              New Entry
            </button>

            <button
              onClick={() => router.push("/settings")}
              className="hidden rounded-full border border-white/20 bg-white/10 p-3 text-white transition hover:bg-white/15 sm:inline-flex"
              title={user?.email ?? "Profile"}
            >
              <UserCircle2 size={20} />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 py-8 lg:flex-row lg:px-10">
        <aside
          className="w-full shrink-0 rounded-[32px] border p-6 shadow-[0_24px_60px_rgba(79,37,42,0.08)] lg:w-[320px]"
          style={{ backgroundColor: COLORS.side, borderColor: COLORS.border }}
        >
          <div
            className="rounded-[28px] border p-6"
            style={{ backgroundColor: "rgba(255,250,244,0.65)", borderColor: COLORS.border }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl"
                style={{ backgroundColor: COLORS.top }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <BookOpen size={28} color="#fff" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: COLORS.textSoft }}>
                  Welcome back
                </p>
                <h2 className="text-3xl font-black">My Journal</h2>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6" style={{ color: COLORS.textSoft }}>
              Keep your memories, ideas, and unfinished thoughts in one warm space.
            </p>

            <div
              className="mt-5 rounded-2xl px-4 py-3 text-sm"
              style={{ backgroundColor: "rgba(241,116,94,0.12)", color: COLORS.text }}
            >
              {user?.email || "Signed in"}
            </div>
          </div>

          <nav className="mt-6 space-y-3">
            <button
              className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left text-white shadow-sm"
              style={{ backgroundColor: COLORS.primary }}
              onClick={() => router.push("/dashboard")}
            >
              <LayoutDashboard size={20} />
              <span className="font-bold">Dashboard</span>
            </button>

            <button
              className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left font-bold transition hover:bg-white/40"
              onClick={() => router.push("/drafts")}
            >
              <FileText size={20} />
              <span>Drafts</span>
            </button>

            <button
              onClick={() => router.push("/settings")}
              className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left font-bold transition hover:bg-white/40"
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        <section className="min-w-0 flex-1 space-y-6">
          <div
            className="overflow-hidden rounded-[36px] border p-7 shadow-[0_28px_70px_rgba(79,37,42,0.10)]"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,250,244,0.96) 0%, rgba(251,243,185,0.86) 100%)",
              borderColor: COLORS.border,
            }}
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p
                  className="text-sm font-semibold uppercase tracking-[0.3em]"
                  style={{ color: COLORS.textSoft }}
                >
                  Overview
                </p>
                <h2 className="mt-2 text-4xl font-black leading-tight lg:text-5xl">
                  A thoughtful space to reflect, preserve meaningful moments, and write with clarity.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7" style={{ color: COLORS.textSoft }}>
                  Designed to help you capture daily experiences with intention, revisit your personal
                  story, and keep every entry or draft organized with ease.
                </p>
              </div>

              <div
                className="rounded-[28px] border px-5 py-4"
                style={{ backgroundColor: "rgba(255,255,255,0.58)", borderColor: COLORS.border }}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: COLORS.textSoft }}>
                  Viewing
                </p>
                <p className="mt-2 text-2xl font-black">{tab === "recent" ? "Recent Entries" : "Drafts"}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.label}
                  className="rounded-[28px] border p-5 shadow-[0_20px_40px_rgba(79,37,42,0.06)]"
                  style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: COLORS.textSoft }}>
                        {stat.label}
                      </p>
                      <p className="mt-4 text-3xl font-black">{stat.value}</p>
                    </div>
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: "rgba(241,116,94,0.12)", color: COLORS.primary }}
                    >
                      <Icon size={22} />
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-6" style={{ color: COLORS.textSoft }}>
                    {stat.note}
                  </p>
                </article>
              );
            })}
          </div>

          {errorMessage && (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
              {errorMessage}
            </div>
          )}

          <div
            className="rounded-[32px] border p-5 shadow-[0_24px_60px_rgba(79,37,42,0.08)]"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border }}
          >
            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: COLORS.border }}>
              <div>
                <h3 className="text-3xl font-black">{tab === "recent" ? "Recent writing" : "Draft workspace"}</h3>
                <p className="mt-1 text-sm" style={{ color: COLORS.textSoft }}>
                  Review, continue, edit, or remove journal items from here.
                </p>
              </div>

              <div
                className="inline-flex w-fit rounded-full border p-1"
                style={{ borderColor: COLORS.border, backgroundColor: "rgba(249,239,188,0.42)" }}
              >
                <button
                  onClick={() => setTab("recent")}
                  className="rounded-full px-5 py-2.5 text-sm font-bold transition"
                  style={{
                    backgroundColor: tab === "recent" ? COLORS.primary : "transparent",
                    color: tab === "recent" ? "#fff" : COLORS.text,
                  }}
                >
                  Recent
                </button>
                <button
                  onClick={() => setTab("drafts")}
                  className="rounded-full px-5 py-2.5 text-sm font-bold transition"
                  style={{
                    backgroundColor: tab === "drafts" ? COLORS.primary : "transparent",
                    color: tab === "drafts" ? "#fff" : COLORS.text,
                  }}
                >
                  Drafts {drafts.length}
                </button>
              </div>
            </div>

            {currentList.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-[24px]"
                  style={{ backgroundColor: "rgba(241,116,94,0.12)", color: COLORS.primary }}
                >
                  <Sparkles size={34} />
                </div>
                <h4 className="mt-6 text-2xl font-black">
                  {tab === "recent" ? "No journal entries yet" : "No drafts yet"}
                </h4>
                <p className="mt-3 max-w-md text-sm leading-6" style={{ color: COLORS.textSoft }}>
                  {tab === "recent"
                    ? "Start your first entry and this space will turn into your writing archive."
                    : "Save ideas as drafts first, then come back when you are ready to finish them."}
                </p>
                <button
                  onClick={() => router.push(tab === "recent" ? "/new-entry" : "/drafts")}
                  className="mt-6 rounded-full px-5 py-3 text-sm font-bold text-white"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  {tab === "recent" ? "Write First Entry" : "Open Drafts"}
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {currentList.map((item) => {
                  const currentItem = item as DashboardItem;
                  const itemDate = tab === "recent" ? currentItem.created_at : currentItem.updated_at;

                  return (
                    <article
                      key={item.id}
                      onClick={() =>
                        router.push(tab === "recent" ? `/entry/${item.id}` : `/drafts/${item.id}`)
                      }
                      className="group cursor-pointer rounded-[28px] border p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(79,37,42,0.10)]"
                      style={{ borderColor: COLORS.border, backgroundColor: "rgba(255,255,255,0.78)" }}
                    >
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="text-2xl font-black text-[#1f1717]">
                              {item.title || (tab === "recent" ? "Untitled Entry" : "Untitled Draft")}
                            </h4>
                            <span
                              className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]"
                              style={{
                                backgroundColor: "rgba(241,116,94,0.14)",
                                color: COLORS.primary,
                              }}
                            >
                              {item.mood || "Neutral"}
                            </span>
                          </div>

                          <p className="mt-3 max-w-3xl text-sm leading-7" style={{ color: COLORS.textSoft }}>
                            {getPreview(item.content)}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: COLORS.textSoft }}>
                            <span>{tab === "recent" ? "Published" : "Updated"} {formatDate(itemDate)}</span>
                            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: COLORS.textSoft }} />
                            <span>{item.content?.length || 0} characters</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={(ev) => {
                              ev.stopPropagation();
                              router.push(tab === "recent" ? `/entry/${item.id}/edit` : `/drafts/${item.id}`);
                            }}
                            className="rounded-full border p-3 transition hover:bg-black/5"
                            style={{ borderColor: COLORS.border }}
                            title={tab === "recent" ? "Edit entry" : "Edit draft"}
                          >
                            <PencilLine size={18} />
                          </button>
                          <button
                            onClick={(ev) => {
                              ev.stopPropagation();
                              if (tab === "recent") {
                                handleDeleteEntry(item.id);
                                return;
                              }
                              handleDeleteDraft(item.id);
                            }}
                            className="rounded-full border p-3 text-[#b63d33] transition hover:bg-red-50"
                            style={{ borderColor: "rgba(182,61,51,0.22)" }}
                            title={tab === "recent" ? "Delete entry" : "Delete draft"}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
