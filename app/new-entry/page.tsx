"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createDraft, createEntry } from "@/lib/journal";
import { getCurrentUser, signOutUser } from "@/lib/auth";

export default function NewEntryPage() {
  const router = useRouter();

  const COLORS = {
    bg: "#edd0ac",
    top: "#4f252a",
    primary: "#f1745e",
    text: "#4f252a",
    cardBorder: "rgba(79,37,42,0.25)",
  };

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");

  const [savingEntry, setSavingEntry] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const emojis = useMemo(
    () => [
      "😀","😊","🥹","😍","😎","🤩","😴","😵","😮","😳",
      "🥲","😡","😭","😇","🤯","😌","🤔","😬","😐","🫶",
      "💪","🙏","🔥","🌸","✨","🌈","⭐","💡","📚","🎯",
      "🎵","🍀","☕","🍓","🌻","🌙","💖","✅",
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
    } catch (error: any) {
      setErrorMessage(error.message || "Logout failed.");
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
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to save entry.");
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
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to save draft.");
    } finally {
      setSavingDraft(false);
    }
  }

  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-2xl font-bold"
        style={{ background: COLORS.bg, color: COLORS.text }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="h-screen overflow-hidden flex flex-col relative"
      style={{ background: COLORS.bg }}
    >
      <header
        className="w-full border-b shadow-md flex-shrink-0"
        style={{ background: COLORS.top }}
      >
        <div className="w-full px-10 py-3 flex justify-end">
          <button
            onClick={handleLogout}
            className="text-white font-bold px-6 py-2 rounded-xl text-base transition"
            style={{ background: COLORS.primary }}
          >
            Log Out
          </button>
        </div>
      </header>

      <main className="flex-1 flex justify-center items-start px-6 py-4 relative overflow-hidden">
        <div className="w-full max-w-[1100px] relative h-full flex flex-col">
          <button
            onClick={() => router.back()}
            className="text-2xl font-extrabold mb-3 flex items-center gap-2 flex-shrink-0"
            style={{ color: COLORS.text }}
          >
            ← Back
          </button>

          <div
            className="bg-white rounded-3xl shadow-xl overflow-hidden flex-1 min-h-0"
            style={{ border: `1.5px solid ${COLORS.cardBorder}` }}
          >
            <div className="px-10 py-4 border-b flex items-center gap-4 flex-shrink-0">
              <span className="text-3xl">🏷️</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full text-2xl font-bold outline-none"
                style={{ color: COLORS.text }}
              />
            </div>

            <div className="px-10 py-4 border-b flex-shrink-0">
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

            <div className="px-10 py-5 h-full min-h-0">
              {errorMessage && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                  {errorMessage}
                </div>
              )}

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing here..."
                className="w-full rounded-xl outline-none resize-none"
                style={{
                  color: "#333",
                  height: errorMessage
                    ? "calc(100vh - 72px - 56px - 64px - 190px)"
                    : "calc(100vh - 72px - 56px - 64px - 140px)",
                }}
              />
            </div>
          </div>

          <img
            src="/images/clock.png"
            alt="Clock"
            className="absolute right-[-180px] top-[55px] w-[270px] h-auto select-none pointer-events-none"
            draggable={false}
          />

          <div className="flex justify-center gap-10 mt-5 flex-shrink-0">
            <button
              onClick={onSave}
              disabled={savingEntry || savingDraft}
              className="px-16 py-4 rounded-2xl font-extrabold text-lg transition shadow-md disabled:opacity-60"
              style={{
                background: COLORS.primary,
                color: "white",
              }}
            >
              {savingEntry ? "Saving..." : "Save"}
            </button>

            <button
              onClick={onSaveDraft}
              disabled={savingEntry || savingDraft}
              className="px-14 py-4 rounded-2xl font-extrabold text-lg transition shadow-md disabled:opacity-60"
              style={{
                background: "#d9d9d9",
                color: "#111",
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