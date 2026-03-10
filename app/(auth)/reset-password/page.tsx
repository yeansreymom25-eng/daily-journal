"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prepareRecovery = async () => {
      await supabase.auth.getSession();
      setReady(true);
    };

    prepareRecovery();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully.");
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#fbe3b9] via-[#edd0ac] to-[#fbe3b9]">
      <div className="w-full max-w-xl bg-white/90 rounded-3xl shadow-xl border border-black/10 p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#4f252a] text-center">
          Create New Password
        </h1>

        <p className="text-center text-[#4f252a]/70 mt-3 mb-6">
          Enter your new password below.
        </p>

        {!ready ? (
          <p className="text-center text-[#4f252a]">Loading...</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2 text-[#4f252a]">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-black/15 rounded-2xl px-5 py-3 text-base outline-none focus:ring-2 focus:ring-[#e06464]/30 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-[#4f252a]">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-black/15 rounded-2xl px-5 py-3 text-base outline-none focus:ring-2 focus:ring-[#e06464]/30 bg-white"
                required
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-12 py-3 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-[#e06464] to-[#f1745e] shadow-lg disabled:opacity-60"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}