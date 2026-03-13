"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  PencilLine,
  Settings,
  Trash2,
  UserCircle2,
} from "lucide-react";
import { getAvatarUrl, getCurrentUser, signOutUser } from "@/lib/auth";
import { createDraft, deleteDraft, getDrafts, type JournalDraft } from "@/lib/journal";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function DraftsPage() {
  const router = useRouter();

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

  const [user, setUser] = useState<User | null>(null);
  const [drafts, setDrafts] = useState<JournalDraft[]>([]);
  const [loading, setLoading] = useState(true);

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
        alert(getErrorMessage(error, "Failed to load drafts."));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const hoverPrimary = (e: React.MouseEvent<HTMLButtonElement>, on: boolean) => {
    e.currentTarget.style.backgroundColor = on ? COLORS.primaryHover : COLORS.primary;
  };

  const createNewDraft = async () => {
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
      alert(getErrorMessage(error, "Failed to create draft."));
    }
  };

  const handleDeleteDraft = async (id: string) => {
    try {
      await deleteDraft(id);
      setDrafts((prev) => prev.filter((draft) => draft.id !== id));
    } catch (error: unknown) {
      console.error(error);
    }
  };

  async function handleLogout() {
    try {
      await signOutUser();
      router.push("/");
    } catch (error: unknown) {
      alert(getErrorMessage(error, "Logout failed."));
    }
  }

  const avatarUrl = getAvatarUrl(user);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.bg }}>
        <header
          className="w-full h-[72px] border-b shadow-md flex items-center justify-end px-8 gap-4"
          style={{ backgroundColor: COLORS.top, borderColor: "#3a1b1f" }}
        >
          <div className="w-24 h-9 rounded-lg bg-white/20 animate-pulse" />
          <div className="w-24 h-9 rounded-lg bg-white/20 animate-pulse" />
          <div className="w-9 h-9 rounded-md bg-white/20 animate-pulse" />
        </header>
        <main className="flex-1 flex">
          <aside
            className="hidden md:flex w-[300px] lg:w-[340px] border-r flex-col"
            style={{ backgroundColor: COLORS.side, borderColor: "rgba(79,37,42,0.3)" }}
          >
            <div
              className="h-[220px] lg:h-[240px] border-b flex flex-col items-center justify-center p-6 gap-4"
              style={{ borderColor: "rgba(79,37,42,0.3)" }}
            >
              <div className="w-[140px] lg:w-[150px] h-[140px] lg:h-[150px] rounded-full bg-black/5 animate-pulse" />
              <div className="w-40 h-8 lg:h-10 rounded-lg bg-black/5 animate-pulse" />
            </div>
            <div className="p-5 lg:p-6 space-y-3">
              <div className="w-full h-14 rounded-lg bg-black/5 animate-pulse" />
              <div className="w-full h-14 rounded-lg bg-black/5 animate-pulse" />
              <div className="w-full h-14 rounded-lg bg-black/5 animate-pulse" />
            </div>
          </aside>
          <section className="flex-1 p-4 sm:p-6 md:p-10">
            <div className="w-32 sm:w-48 md:w-64 h-12 md:h-16 rounded-xl bg-black/5 animate-pulse mb-6 sm:mb-8" />
            <div
              className="w-full h-[400px] rounded-xl bg-white border animate-pulse"
              style={{ borderColor: "rgba(79,37,42,0.25)" }}
            />
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <header
        className="w-full border-b shadow-md"
        style={{ backgroundColor: COLORS.top, borderColor: "#3a1b1f" }}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 py-4 flex items-center justify-end gap-3 sm:gap-4">
          <button
            onClick={() => router.push("/new-entry")}
            className="text-white font-bold px-4 sm:px-5 py-2 rounded-lg transition text-sm sm:text-base"
            style={{ backgroundColor: COLORS.primary }}
            onMouseEnter={(e) => hoverPrimary(e, true)}
            onMouseLeave={(e) => hoverPrimary(e, false)}
          >
            + New Entry
          </button>

          <button
            onClick={handleLogout}
            className="text-white font-bold px-4 sm:px-5 py-2 rounded-lg transition text-sm sm:text-base"
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
            <UserCircle2 size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex">
        <aside
          className="hidden md:flex w-[300px] lg:w-[340px] border-r flex-col"
          style={{
            backgroundColor: COLORS.side,
            borderColor: "rgba(79,37,42,0.3)",
          }}
        >
          <div
            className="h-[220px] lg:h-[240px] border-b flex flex-col items-center justify-center gap-4"
            style={{ borderColor: "rgba(79,37,42,0.3)" }}
          >
            <div
              className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[28px]"
              style={{ backgroundColor: COLORS.top }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <BookOpen size={40} color="#fff" />
              )}
            </div>
            <div className="text-3xl lg:text-4xl font-extrabold" style={{ color: COLORS.text }}>
              My Journal
            </div>
          </div>

          <div className="flex-1 px-5 lg:px-6 py-6 space-y-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-lg font-bold transition"
              style={{ color: COLORS.text }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(237,208,172,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <LayoutDashboard size={22} />
              Dashboard
            </button>

            <button
              className="w-full flex items-center gap-4 px-5 py-4 rounded-lg text-white font-bold"
              style={{ backgroundColor: COLORS.primary }}
            >
              <FileText size={22} />
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
              <Settings size={22} />
              Settings
            </button>
          </div>
        </aside>

        <section className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="flex items-center justify-between gap-3">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold"
              style={{ color: COLORS.text }}
            >
              Drafts
            </h1>

            <button
              onClick={createNewDraft}
              className="px-4 sm:px-6 py-3 font-bold text-white rounded-lg transition text-sm sm:text-base"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => hoverPrimary(e, true)}
              onMouseLeave={(e) => hoverPrimary(e, false)}
            >
              + New Draft
            </button>
          </div>

          <div
            className="mt-6 sm:mt-8 rounded-xl border overflow-hidden"
            style={{
              backgroundColor: COLORS.card,
              borderColor: COLORS.border,
              boxShadow: "0 18px 35px rgba(79,37,42,0.18)",
            }}
          >
            {drafts.length === 0 ? (
              <div className="px-6 py-10 text-xl" style={{ color: COLORS.text }}>
                No drafts yet.
              </div>
            ) : (
              drafts.map((draft) => (
                <div
                  key={draft.id}
                  onClick={() => router.push(`/drafts/${draft.id}`)}
                  className="cursor-pointer px-4 sm:px-6 md:px-8 py-5 sm:py-6 border-b flex items-center justify-between transition"
                  style={{ borderColor: "rgba(79,37,42,0.10)" }}
                  onMouseEnter={(ev) => {
                    ev.currentTarget.style.backgroundColor = "rgba(251,243,185,0.40)";
                  }}
                  onMouseLeave={(ev) => {
                    ev.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1b1b1b] truncate">
                      {draft.title || "Untitled Draft"}{" "}
                      <span className="text-lg sm:text-xl md:text-2xl">{draft.mood}</span>
                    </div>
                    <div className="text-gray-600 text-sm sm:text-base md:text-lg mt-1 truncate">
                      {draft.content ? draft.content.slice(0, 90) : "Start writing your draft..."}
                    </div>
                  </div>

                  <div className="flex gap-4 sm:gap-5 opacity-80 flex-shrink-0">
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        router.push(`/drafts/${draft.id}`);
                      }}
                      title="Edit draft"
                    >
                      <PencilLine size={20} />
                    </button>
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        handleDeleteDraft(draft.id);
                      }}
                      title="Delete draft"
                    >
                      <Trash2 size={20} />
                    </button>
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
