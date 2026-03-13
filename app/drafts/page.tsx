"use client";

import { useEffect, useState } from "react";
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
import { createDraft, deleteDraft, getDrafts, type JournalDraft } from "@/lib/journal";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function getPreview(content: string) {
  if (!content.trim()) return "Start writing your draft...";
  return content.length > 120 ? `${content.slice(0, 120)}...` : content;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function DraftsPage() {
  const router = useRouter();

  const COLORS = {
    page: "#ecd3b2",
    panel: "#fffaf4",
    top: "#4f252a",
    primary: "#f1745e",
    primaryHover: "#df624f",
    side: "#f9efbc",
    text: "#4f252a",
    textSoft: "#7d5953",
    border: "rgba(79,37,42,0.14)",
  };

  const [user, setUser] = useState<User | null>(null);
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
        const data = await getDrafts();
        setDrafts(data);
      } catch (error: unknown) {
        setErrorMessage(getErrorMessage(error, "Failed to load drafts."));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  async function createNewDraft() {
    if (!user) return;

    try {
      const newDraft = await createDraft({
        user_id: user.id,
        title: "Draft: New idea",
        content: "",
        mood: "",
      });

      router.push(`/drafts/${newDraft.id}`);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Failed to create draft."));
    }
  }

  async function handleDeleteDraft(id: string) {
    try {
      await deleteDraft(id);
      setDrafts((prev) => prev.filter((draft) => draft.id !== id));
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Failed to delete draft."));
    }
  }

  async function handleLogout() {
    try {
      await signOutUser();
      router.push("/");
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Logout failed."));
    }
  }

  const avatarUrl = getAvatarUrl(user);

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
        <div className="relative mx-auto flex max-w-[1440px] items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Daily Journal</p>
            <h1 className="mt-1 text-2xl font-black text-white">Your draft workspace</h1>
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
              Keep unfinished thoughts close and return when your ideas are ready.
            </p>
          </div>

          <nav className="mt-6 space-y-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left font-bold transition hover:bg-white/40"
              style={{ color: COLORS.text }}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>

            <button
              className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left text-white shadow-sm"
              style={{ backgroundColor: COLORS.primary }}
            >
              <FileText size={20} />
              <span className="font-bold">Drafts</span>
            </button>

            <button
              onClick={() => router.push("/settings")}
              className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left font-bold transition hover:bg-white/40"
              style={{ color: COLORS.text }}
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
                  Drafts
                </p>
                <h2 className="mt-2 text-4xl font-black leading-tight lg:text-5xl">
                  Shape your ideas before they become finished entries.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7" style={{ color: COLORS.textSoft }}>
                  Keep half-written thoughts, return to them later, and publish when the story feels ready.
                </p>
              </div>

              <button
                onClick={createNewDraft}
                className="w-fit rounded-full px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
                style={{ backgroundColor: COLORS.primary }}
              >
                + New Draft
              </button>
            </div>
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
            <div className="border-b pb-5" style={{ borderColor: COLORS.border }}>
              <h3 className="text-3xl font-black">All drafts</h3>
              <p className="mt-1 text-sm" style={{ color: COLORS.textSoft }}>
                Review, continue, or remove drafts from one place.
              </p>
            </div>

            {drafts.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-[24px]"
                  style={{ backgroundColor: "rgba(241,116,94,0.12)", color: COLORS.primary }}
                >
                  <Sparkles size={34} />
                </div>
                <h4 className="mt-6 text-2xl font-black">No drafts yet</h4>
                <p className="mt-3 max-w-md text-sm leading-6" style={{ color: COLORS.textSoft }}>
                  Start a draft now and come back whenever inspiration returns.
                </p>
                <button
                  onClick={createNewDraft}
                  className="mt-6 rounded-full px-5 py-3 text-sm font-bold text-white"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Create First Draft
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {drafts.map((draft) => (
                  <article
                    key={draft.id}
                    onClick={() => router.push(`/drafts/${draft.id}`)}
                    className="group cursor-pointer rounded-[28px] border p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(79,37,42,0.10)]"
                    style={{ borderColor: COLORS.border, backgroundColor: "rgba(255,255,255,0.78)" }}
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-2xl font-black text-[#1f1717]">
                            {draft.title || "Untitled Draft"}
                          </h4>
                          <span
                            className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]"
                            style={{
                              backgroundColor: "rgba(241,116,94,0.14)",
                              color: COLORS.primary,
                            }}
                          >
                            {draft.mood || "Draft"}
                          </span>
                        </div>

                        <p className="mt-3 max-w-3xl text-sm leading-7" style={{ color: COLORS.textSoft }}>
                          {getPreview(draft.content)}
                        </p>

                        <div
                          className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]"
                          style={{ color: COLORS.textSoft }}
                        >
                          <span>Updated {formatDate(draft.updated_at)}</span>
                          <span className="h-1 w-1 rounded-full" style={{ backgroundColor: COLORS.textSoft }} />
                          <span>{draft.content?.length || 0} characters</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            router.push(`/drafts/${draft.id}`);
                          }}
                          className="rounded-full border p-3 transition hover:bg-black/5"
                          style={{ borderColor: COLORS.border }}
                          title="Edit draft"
                        >
                          <PencilLine size={18} />
                        </button>
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            handleDeleteDraft(draft.id);
                          }}
                          className="rounded-full border p-3 text-[#b63d33] transition hover:bg-red-50"
                          style={{ borderColor: "rgba(182,61,51,0.22)" }}
                          title="Delete draft"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
