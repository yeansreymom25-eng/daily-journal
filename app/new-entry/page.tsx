"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut, Tag } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createDraft, createEntry } from "@/lib/journal";
import { getCurrentUser, signOutUser } from "@/lib/auth";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function NewEntryPage() {
  const router = useRouter();

  const COLORS = {
    top: "#4f252a",
    primary: "#f1745e",
    primaryHover: "#df624f",
    text: "#4f252a",
    textSoft: "#7d5953",
    panel: "#fffaf4",
    panelSoft: "rgba(255,250,244,0.78)",
    border: "rgba(79,37,42,0.14)",
  };

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");

  const [savingEntry, setSavingEntry] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const emojis = useMemo(
    () => [
      "😀", "😊", "🥹", "😍", "😎", "🤩", "😴", "😵", "😮", "😳",
      "🥲", "😡", "😭", "😇", "🤯", "😌", "🤔", "😬", "😐", "🫶",
      "💪", "🙏", "🔥", "🌸", "✨", "🌈", "⭐", "💡", "📚", "🎯",
      "🎵", "🍀", "☕", "🍓", "🌻", "🌙", "💖", "✅",
    ],
    []
  );

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);
      setAuthLoading(false);
    };

    loadUser();
  }, [router]);

  async function handleLogout() {
    try {
      await signOutUser();
      router.push("/login");
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Logout failed."));
    }
  }

  async function onSave() {
    if (!user || savingEntry || savingDraft) return;

    setErrorMessage("");
    setSavingEntry(true);

    try {
      const entry = await createEntry({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        mood: selectedEmoji,
      });

      router.push(`/entry/${entry.id}`);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Failed to save entry."));
    } finally {
      setSavingEntry(false);
    }
  }

  async function onSaveDraft() {
    if (!user || savingEntry || savingDraft) return;

    setErrorMessage("");
    setSavingDraft(true);

    try {
      const draft = await createDraft({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        mood: selectedEmoji,
      });

      router.push(`/drafts/${draft.id}`);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Failed to save draft."));
    } finally {
      setSavingDraft(false);
    }
  }

  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-2xl font-bold"
        style={{
          background: "linear-gradient(180deg, #f7e8d0 0%, #ecd3b2 55%, #e5c5a0 100%)",
          color: COLORS.text,
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(180deg, #f7e8d0 0%, #ecd3b2 55%, #e5c5a0 100%)",
      }}
    >
      <header
        className="w-full border-b shadow-sm"
        style={{ backgroundColor: COLORS.top, borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-end px-4 py-4 sm:px-6 lg:px-10">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition"
            style={{ backgroundColor: COLORS.primary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.primary;
            }}
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="w-full">
          <button
            onClick={() => router.back()}
            className="mb-5 inline-flex items-center gap-2 text-base font-black transition hover:opacity-75 sm:text-lg"
            style={{ color: COLORS.text }}
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div
            className="overflow-hidden rounded-[28px] border shadow-[0_28px_70px_rgba(79,37,42,0.10)] sm:rounded-[36px]"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border }}
          >
            <div
              className="border-b px-6 py-5 sm:px-8"
              style={{ backgroundColor: COLORS.panelSoft, borderColor: COLORS.border }}
            >
              <div className="mb-2 text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: COLORS.textSoft }}>
                New Entry
              </div>
              <div className="flex items-center gap-3">
                <Tag size={20} color={COLORS.primary} />
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="w-full bg-transparent text-2xl font-black outline-none sm:text-3xl"
                  style={{ color: COLORS.text }}
                />
              </div>
            </div>

            <div
              className="border-b px-6 py-5 sm:px-8"
              style={{ backgroundColor: COLORS.panelSoft, borderColor: COLORS.border }}
            >
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: COLORS.textSoft }}>
                Mood
              </div>
              <div className="flex flex-wrap gap-3">
                {emojis.map((emoji) => {
                  const active = selectedEmoji === emoji;

                  return (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                    className="rounded-2xl border px-3 py-2 text-xl shadow-sm transition sm:px-4 sm:text-2xl"
                      style={{
                        borderColor: active ? COLORS.primary : "rgba(79,37,42,0.12)",
                        backgroundColor: active ? "rgba(241,116,94,0.14)" : "rgba(255,255,255,0.92)",
                      }}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-6 sm:px-8">
              {errorMessage && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                  {errorMessage}
                </div>
              )}

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing here..."
                className="min-h-[320px] w-full resize-none bg-transparent text-base leading-7 outline-none sm:min-h-[420px] sm:text-lg sm:leading-8"
                style={{ color: COLORS.text }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5">
            <button
              onClick={onSave}
              disabled={savingEntry || savingDraft}
              className="w-full rounded-full px-8 py-4 text-base font-black text-white shadow-md transition disabled:opacity-60 sm:w-auto sm:px-12 sm:text-lg"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary;
              }}
            >
              {savingEntry ? "Saving..." : "Save"}
            </button>

            <button
              onClick={onSaveDraft}
              disabled={savingEntry || savingDraft}
              className="w-full rounded-full border px-8 py-4 text-base font-black transition disabled:opacity-60 sm:w-auto sm:px-12 sm:text-lg"
              style={{
                backgroundColor: COLORS.panel,
                borderColor: COLORS.border,
                color: COLORS.text,
              }}
            >
              {savingDraft ? "Saving Draft..." : "Save as Draft"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
