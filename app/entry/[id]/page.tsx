"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { deleteEntry, getEntryById } from "@/lib/journal";
import { getCurrentUser, signOutUser } from "@/lib/auth";

export default function EntryDetailPage() {
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
  };

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [mood, setMood] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

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
        setMood(entry.mood || "📝");
        setContent(entry.content || "");
        setDate(
          new Date(entry.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );
      } catch (error: any) {
        alert(error.message || "Failed to load entry.");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEntry();
    }
  }, [id, router]);

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

 async function handleDelete() {
  try {
    await deleteEntry(id);
    router.push("/dashboard");
  } catch (error: any) {
    console.error(error);
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
    <div className="min-h-screen md:h-screen flex flex-col overflow-hidden" style={{ backgroundColor: COLORS.bg }}>
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
                onClick={() => router.push("/dashboard")}
                className="text-5xl sm:text-6xl font-bold leading-none"
                style={{ color: COLORS.text }}
              >
                ←
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold truncate" style={{ color: COLORS.text }}>
                    {title}
                  </h1>
                  <span className="text-4xl sm:text-5xl">{mood}</span>
                </div>

                <div className="mt-2 text-xl sm:text-2xl md:text-3xl" style={{ color: "rgba(79,37,42,0.55)" }}>
                  {date}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex-1 flex gap-6 lg:gap-10 items-start overflow-hidden flex-col lg:flex-row">
            <div
              className="flex-1 rounded-2xl border p-6 sm:p-10 h-full overflow-hidden w-full"
              style={{
                backgroundColor: COLORS.card,
                borderColor: COLORS.border,
                boxShadow: "0 18px 35px rgba(79,37,42,0.18)",
              }}
            >
              <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed whitespace-pre-wrap" style={{ color: COLORS.text }}>
                {content}
              </p>
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
              onClick={() => router.push(`/entry/${id}/edit`)}
              className="px-10 sm:px-16 py-4 sm:py-5 rounded-xl text-xl sm:text-3xl font-bold text-white transition"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => hoverPrimary(e, true)}
              onMouseLeave={(e) => hoverPrimary(e, false)}
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="px-10 sm:px-16 py-4 sm:py-5 rounded-xl text-xl sm:text-3xl font-bold border transition"
              style={{
                backgroundColor: "rgba(255,255,255,0.55)",
                borderColor: COLORS.border,
                color: "#cc1f1f",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}