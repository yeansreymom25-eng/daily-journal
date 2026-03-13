"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";
import { deleteEntry, getEntryById } from "@/lib/journal";
import { getCurrentUser, signOutUser } from "@/lib/auth";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function EntryDetailPage() {
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
  const [date, setDate] = useState("");
  const [mood, setMood] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadEntry = async () => {
      const user = await getCurrentUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const entry = await getEntryById(id);

        setTitle(entry.title || "Untitled Entry");
        setMood(entry.mood || "");
        setContent(entry.content || "");
        setDate(
          new Date(entry.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );
      } catch (error: unknown) {
        setErrorMessage(getErrorMessage(error, "Failed to load entry."));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEntry();
    } else {
      setLoading(false);
      setErrorMessage("Invalid entry ID.");
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

  async function handleDelete() {
    if (!id || deleting) return;

    setDeleting(true);
    setErrorMessage("");

    try {
      await deleteEntry(id);
      router.push("/dashboard");
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Failed to delete entry."));
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
            onClick={() => router.push("/dashboard")}
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
                {date}
              </div>
            </div>

            <div className="px-6 py-6 sm:px-8">
              {errorMessage && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                  {errorMessage}
                </div>
              )}

              <p
                className="min-h-[320px] whitespace-pre-wrap text-lg leading-8 sm:min-h-[420px]"
                style={{ color: COLORS.text }}
              >
                {content}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-5">
            <button
              onClick={() => router.push(`/entry/${id}/edit`)}
              className="rounded-full px-12 py-4 text-lg font-black text-white shadow-md transition"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary;
              }}
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting}
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
