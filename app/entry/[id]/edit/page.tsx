"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, LogOut, Tag } from "lucide-react";
import { getCurrentUser, signOutUser } from "@/lib/auth";
import { getEntryById, updateEntry } from "@/lib/journal";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function EditEntryPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id || "");

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

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    const loadEntry = async () => {
      const user = await getCurrentUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const entry = await getEntryById(id);
        setTitle(entry.title);
        setContent(entry.content);
        setSelectedEmoji(entry.mood || "");
      } catch (error: unknown) {
        setErrorMessage(getErrorMessage(error, "Failed to load entry."));
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEntry();
    }
  }, [id, router]);

  async function handleLogout() {
    try {
      await signOutUser();
      router.push("/login");
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Logout failed."));
    }
  }

  async function onSave() {
    if (saving) return;

    setSaving(true);
    setErrorMessage("");

    try {
      await updateEntry(id, {
        title: title.trim(),
        content: content.trim(),
        mood: selectedEmoji,
      });

      router.push(`/entry/${id}`);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Failed to update entry."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
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
        <div className="mx-auto flex max-w-[1440px] items-center justify-end px-6 py-4 lg:px-10">
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

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 px-6 py-8 lg:px-10">
        <div className="w-full">
          <button
            onClick={() => router.push(`/entry/${id}`)}
            className="mb-5 inline-flex items-center gap-2 text-lg font-black transition hover:opacity-75"
            style={{ color: COLORS.text }}
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div
            className="overflow-hidden rounded-[36px] border shadow-[0_28px_70px_rgba(79,37,42,0.10)]"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border }}
          >
            <div
              className="border-b px-6 py-5 sm:px-8"
              style={{ backgroundColor: COLORS.panelSoft, borderColor: COLORS.border }}
            >
              <div className="mb-2 text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: COLORS.textSoft }}>
                Edit Entry
              </div>
              <div className="flex items-center gap-3">
                <Tag size={20} color={COLORS.primary} />
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="w-full bg-transparent text-3xl font-black outline-none"
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
                      className="rounded-2xl border px-4 py-2 text-2xl shadow-sm transition"
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
                className="min-h-[360px] w-full resize-none bg-transparent text-lg leading-8 outline-none sm:min-h-[420px]"
                style={{ color: COLORS.text }}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={onSave}
              disabled={saving}
              className="rounded-full px-12 py-4 text-lg font-black text-white shadow-md transition disabled:opacity-60"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary;
              }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
