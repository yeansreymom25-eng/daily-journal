"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const prepareRecovery = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        alert("Invalid or expired password reset link. Please try again.");
        router.replace("/forgot-password");
        return;
      }

      setReady(true);
    };

    prepareRecovery();
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage("Password updated successfully. Redirecting to login...");
    setTimeout(() => router.push("/login"), 1500);
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #f7e8d0 0%, #ecd3b2 55%, #e5c5a0 100%)",
      }}
    >
      <main className="mx-auto flex min-h-screen max-w-[900px] items-center px-6 py-12 lg:px-10">
        <div
          className="w-full rounded-[36px] border p-8 shadow-[0_28px_70px_rgba(79,37,42,0.10)]"
          style={{ backgroundColor: "#fffaf4", borderColor: "rgba(79,37,42,0.14)" }}
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "#4f252a" }}
          >
            <LockKeyhole size={28} color="#fff" />
          </div>

          <h1 className="mt-6 text-4xl font-black text-[#4f252a]">Create New Password</h1>
          <p className="mt-4 text-sm leading-7 text-[#7d5953]">Choose a strong new password for your account.</p>

          {!ready ? (
            <p className="mt-6 text-lg font-semibold text-[#4f252a]">Loading...</p>
          ) : (
            <>
              {errorMessage && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                  {successMessage}
                </div>
              )}

              <form onSubmit={onSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#4f252a]">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border bg-white px-5 py-3 pr-14 outline-none focus:ring-2 focus:ring-[#f1745e]/30"
                      style={{ borderColor: "rgba(79,37,42,0.14)" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7d5953]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#4f252a]">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-2xl border bg-white px-5 py-3 pr-14 outline-none focus:ring-2 focus:ring-[#f1745e]/30"
                      style={{ borderColor: "rgba(79,37,42,0.14)" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7d5953]"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full px-8 py-4 text-sm font-black text-white shadow-md transition disabled:opacity-60"
                  style={{ backgroundColor: "#f1745e" }}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
