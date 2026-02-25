"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Draft = {
  id: string;
  title: string | null;
  content: string | null;
  mood: string | null;
  created_at: string | null;
};

export default function DraftDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id || "");

  const COLORS = {
    bg: "#edd0ac",
    top: "#4f252a",
    text: "#4f252a",
    primary: "#f1745e",
    primaryHover: "#e06464",
    border: "rgba(79,37,42,0.22)",
    card: "rgba(255,255,255,0.65)",
    softWhite: "rgba(255,255,255,0.55)",
  };

  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);

  const [title, setTitle] = useState<string>("Draft");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("drafts")
        .select("id,title,content,mood,created_at,user_id")
        .eq("id", id)
        .single();

      if (error) {
        alert(error.message);
        router.push("/drafts");
        return;
      }

      // basic safety check (RLS should protect too)
      if (!data) {
        router.push("/drafts");
        return;
      }

      setDraft(data as any);
      setTitle((data as any).title || "Draft");
      setContent((data as any).content || "");
      setLoading(false);
    })();
  }, [id, router]);

  const hoverPrimary = (e: React.MouseEvent<HTMLButtonElement>, on: boolean) => {
    e.currentTarget.style.backgroundColor = on ? COLORS.primaryHover : COLORS.primary;
  };

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function saveDraft() {
    const { error } = await supabase
      .from("drafts")
      .update({
        title: title.trim(),
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Saved ✅");
  }

  async function deleteDraft() {
    const ok = confirm("Delete this draft?");
    if (!ok) return;

    const { error } = await supabase.from("drafts").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }

    router.push("/drafts");
  }

  async function publishDraft() {
    if (!draft) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Create entry
    const { error: insertErr } = await supabase.from("journal_entries").insert({
      user_id: user.id,
      title: title.trim(),
      content,
      mood: draft.mood || null,
    });

    if (insertErr) {
      alert(insertErr.message);
      return;
    }

    // Delete draft after publish
    const { error: delErr } = await supabase.from("drafts").delete().eq("id", id);
    if (delErr) {
      alert(delErr.message);
      return;
    }

    router.push("/dashboard");
  }

  if (loading) {
    return <div className="p-10 text-lg">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      {/* TOP BAR */}
      <header className="w-full" style={{ backgroundColor: COLORS.top }}>
        <div className="w-full px-10 py-4 flex items-center justify-end">
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

      {/* BODY */}
      <main className="flex-1 px-10 py-10">
        <div className="mx-auto w-full max-w-6xl">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <button
                onClick={() => router.push("/drafts")}
                className="text-6xl font-bold leading-none mt-2"
                style={{ color: COLORS.text }}
              >
                ←
              </button>

              <div>
                <div className="flex items-center gap-4">
                  <h1 className="text-6xl font-extrabold" style={{ color: COLORS.text }}>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-transparent outline-none"
                      style={{ color: COLORS.text }}
                    />
                  </h1>
                  <span className="text-5xl">{draft?.mood || "📝"}</span>
                </div>

                <div className="mt-3 text-3xl" style={{ color: "rgba(79,37,42,0.55)" }}>
                  {draft?.created_at ? new Date(draft.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
                </div>
              </div>
            </div>

            <div className="text-4xl mt-3" style={{ color: COLORS.text }}>
              📝
            </div>
          </div>

          {/* Content Row */}
          <div className="mt-10 flex gap-12 items-start">
            <div
              className="flex-1 rounded-2xl border"
              style={{
                backgroundColor: COLORS.card,
                borderColor: COLORS.border,
                boxShadow: "0 18px 35px rgba(79,37,42,0.18)",
                overflow: "hidden",
              }}
            >
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your draft..."
                className="w-full min-h-[320px] p-10 text-3xl leading-relaxed outline-none resize-none"
                style={{ backgroundColor: "transparent", color: COLORS.text }}
              />
            </div>

            <div className="w-[360px] flex items-center justify-center">
              <img
                src="/images/coffee.png"
                alt="Coffee"
                className="absolute right-150 top-130 w-[600px] h-auto"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex items-center gap-10">
            <button
              onClick={saveDraft}
              className="px-16 py-5 rounded-xl text-3xl font-bold text-white transition"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => hoverPrimary(e, true)}
              onMouseLeave={(e) => hoverPrimary(e, false)}
            >
              Save
            </button>

            <button
              onClick={publishDraft}
              className="px-16 py-5 rounded-xl text-3xl font-bold border transition"
              style={{
                backgroundColor: COLORS.softWhite,
                borderColor: COLORS.border,
                color: COLORS.text,
              }}
            >
              Publish
            </button>

            <button
              onClick={deleteDraft}
              className="px-16 py-5 rounded-xl text-3xl font-bold border transition"
              style={{
                backgroundColor: COLORS.softWhite,
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