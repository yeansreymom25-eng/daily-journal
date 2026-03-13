"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";
import { getCurrentUser, signOutUser } from "@/lib/auth";
import {
  deleteDraft,
  getDraftById,
  publishDraft,
  updateDraft,
} from "@/lib/journal";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function DraftDetailPage() {
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

  const [title, setTitle] = useState("Draft");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(true);

  const [savingPublish, setSavingPublish] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        setMood(draft.mood || "");
        setCreatedAt(
          new Date(draft.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );
      } catch (error: unknown) {
        setErrorMessage(getErrorMessage(error, "Failed to load draft."));
        router.push("/drafts");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDraft();
    }
  }, [id, router]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [content]);

  async function handleLogout() {
    try {
      await signOutUser();
      router.push("/login");
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Logout failed."));
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
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Failed to save draft."));
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
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Failed to publish draft."));
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
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Failed to delete draft."));
    } finally {
      setDeleting(false);
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
            onClick={() => router.push("/drafts")}
            className="mb-5 inline-flex items-center gap-2 text-lg font-black transition hover:opacity-75"
            style={{ color: COLORS.text }}
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div
            className="rounded-[36px] border shadow-[0_28px_70px_rgba(79,37,42,0.10)]"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border }}
          >
            <div
              className="border-b px-6 py-5 sm:px-8"
              style={{ backgroundColor: COLORS.panelSoft, borderColor: COLORS.border }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black sm:text-5xl" style={{ color: COLORS.text }}>
                  {title}
                </h1>
                {mood && <span className="text-4xl">{mood}</span>}
              </div>
              <div className="mt-3 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: COLORS.textSoft }}>
                {createdAt}
              </div>
            </div>

            <div className="px-6 py-6 sm:px-8">
              {errorMessage && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                  {errorMessage}
                </div>
              )}

              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your draft..."
                className="min-h-[320px] w-full resize-none bg-transparent text-lg leading-8 outline-none sm:min-h-[420px]"
                style={{ color: COLORS.text }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-5">
            <button
              onClick={handlePublish}
              disabled={savingPublish || savingDraft || deleting}
              className="rounded-full px-12 py-4 text-lg font-black text-white shadow-md transition disabled:opacity-60"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary;
              }}
            >
              {savingPublish ? "Saving..." : "Publish"}
            </button>

            <button
              onClick={handleSaveAsDraft}
              disabled={savingPublish || savingDraft || deleting}
              className="rounded-full border px-12 py-4 text-lg font-black transition disabled:opacity-60"
              style={{
                backgroundColor: COLORS.panelSoft,
                borderColor: COLORS.border,
                color: COLORS.text,
              }}
            >
              {savingDraft ? "Saving Draft..." : "Save Draft"}
            </button>

            <button
              onClick={handleDelete}
              disabled={savingPublish || savingDraft || deleting}
              className="rounded-full border px-12 py-4 text-lg font-black transition disabled:opacity-60"
              style={{
                backgroundColor: COLORS.panelSoft,
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
