"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCurrentUser, signOutUser } from "@/lib/auth";
import { deleteDraft, getDraftById, publishDraft, updateDraft } from "@/lib/journal";

export default function DraftDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id || "");

  const COLORS = {
    bg: "#edd0ac",
    top: "#4f252a",
    side: "#fbf3b9",
    text: "#4f252a",
    primary: "#f1745e",
    primaryHover: "#e06464",
    border: "rgba(79,37,42,0.22)",
    card: "rgba(255,255,255,0.65)",
    softWhite: "rgba(255,255,255,0.55)",
  };

  const [title, setTitle] = useState("Draft");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(true);

  const [savingPublish, setSavingPublish] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadDraft = async () => {
      const user = await getCurrentUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const draft = await getDraftById(id);
        setTitle(draft.title || "Draft");
        setContent(draft.content || "");
        setMood(draft.mood || "📝");
        setCreatedAt(
          new Date(draft.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );
      } catch (error: any) {
        setErrorMessage(error.message || "Failed to load draft.");
        router.push("/drafts");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDraft();
    }
  }, [id, router]);

  const hoverPrimary = (e: React.MouseEvent<HTMLButtonElement>, on: boolean) => {
    e.currentTarget.style.backgroundColor = on
      ? COLORS.primaryHover
      : COLORS.primary;
  };

  async function handleLogout() {
    try {
      await signOutUser();
      router.push("/login");
    } catch (error: any) {
      setErrorMessage(error.message || "Logout failed.");
    }
  }

  async function handleSaveAsDraft() {
    if (savingPublish || savingDraft || deleting) return;

    setErrorMessage("");
    setSavingDraft(true);

    try {
      await updateDraft(id, {
        title,
        content,
        mood,
      });

      router.push("/drafts");
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to save draft.");
    } finally {
      setSavingDraft(false);
    }
  }

  async function handlePublish() {
    if (savingPublish || savingDraft || deleting) return;

    setErrorMessage("");
    setSavingPublish(true);

    try {
      await updateDraft(id, {
        title,
        content,
        mood,
      });

      const entry = await publishDraft(id);
      router.push(`/entry/${entry.id}`);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to publish draft.");
    } finally {
      setSavingPublish(false);
    }
  }

  async function handleDelete() {
    if (savingPublish || savingDraft || deleting) return;

    setErrorMessage("");
    setDeleting(true);

    try {
      await deleteDraft(id);
      router.push("/drafts");
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to delete draft.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-2xl font-bold"
        style={{ backgroundColor: COLORS.bg, color: COLORS.text }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen md:h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: COLORS.bg }}
    >
      <header className="w-full flex-shrink-0" style={{ backgroundColor: COLORS.top }}>
        <div className="w-full px-4 sm:px-6 md:px-10 py-4 flex items-center justify-end">
          <button
            onClick={handleLogout}
            className="text-white font-bold px-5 py-2 rounded-lg transition"
            style={{ backgroundColor: COLORS.primary }}
            onMouseEnter={(e) => hoverPrimary(e, true)}
            onMouseLeave={(e) => hoverPrimary(e, false)}
          >
            Log Out
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden px-4 sm:px-6 md:px-10 py-6">
        <div className="mx-auto w-full max-w-6xl h-full flex flex-col">
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4 sm:gap-6 min-w-0">
              <button
                onClick={() => router.push("/drafts")}
                className="text-5xl sm:text-6xl font-bold leading-none"
                style={{ color: COLORS.text }}
              >
                ←
              </button>

            <div className="flex items-center gap-3 sm:gap-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent outline-none text-4xl sm:text-5xl md:text-6xl font-extrabold"
                style={{
                  color: COLORS.text,
                  width: `${Math.max(title.length || 5, 5)}ch`,
                  minWidth: "5ch",
                  maxWidth: "420px",
                }}
              />
              <span className="text-4xl sm:text-5xl flex-shrink-0">{mood}</span>
            </div>

                <div
                  className="mt-2 text-xl sm:text-2xl md:text-3xl"
                  style={{ color: "rgba(79,37,42,0.55)" }}
                >
                  {createdAt}
                </div>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="mt-6 flex-1 flex gap-6 lg:gap-10 items-start overflow-hidden flex-col lg:flex-row">
            <div
              className="flex-1 rounded-2xl border p-6 sm:p-10 h-full overflow-hidden w-full"
              style={{
                backgroundColor: COLORS.card,
                borderColor: COLORS.border,
                boxShadow: "0 18px 35px rgba(79,37,42,0.18)",
              }}
            >
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your draft..."
                className="w-full h-full outline-none resize-none text-xl sm:text-2xl md:text-3xl leading-relaxed whitespace-pre-wrap"
                style={{ backgroundColor: "transparent", color: COLORS.text }}
              />
            </div>

            <div className="hidden lg:block w-[360px] relative h-full overflow-hidden">
              <img
                src="/images/coffee.png"
                alt="Coffee"
                className="w-[420px] h-auto select-none"
                draggable={false}
                style={{ marginLeft: "-60px", marginTop: "20px" }}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4 sm:gap-10 flex-shrink-0 flex-wrap">
            <button
              onClick={handlePublish}
              disabled={savingPublish || savingDraft || deleting}
              className="px-10 sm:px-16 py-4 sm:py-5 rounded-xl text-xl sm:text-3xl font-bold text-white transition disabled:opacity-60"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => hoverPrimary(e, true)}
              onMouseLeave={(e) => hoverPrimary(e, false)}
            >
              {savingPublish ? "Saving..." : "Save"}
            </button>

            <button
              onClick={handleSaveAsDraft}
              disabled={savingPublish || savingDraft || deleting}
              className="px-10 sm:px-16 py-4 sm:py-5 rounded-xl text-xl sm:text-3xl font-bold border transition disabled:opacity-60"
              style={{
                backgroundColor: "rgba(255,255,255,0.55)",
                borderColor: COLORS.border,
                color: COLORS.text,
              }}
            >
              {savingDraft ? "Saving Draft..." : "Save as Draft"}
            </button>

            <button
              onClick={handleDelete}
              disabled={savingPublish || savingDraft || deleting}
              className="px-10 sm:px-16 py-4 sm:py-5 rounded-xl text-xl sm:text-3xl font-bold border transition disabled:opacity-60"
              style={{
                backgroundColor: "rgba(255,255,255,0.55)",
                borderColor: COLORS.border,
                color: "#cc1f1f",
              }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}