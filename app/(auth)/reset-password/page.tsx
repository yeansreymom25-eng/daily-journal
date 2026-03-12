"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
      await supabase.auth.getSession();
      setReady(true);
    };

    prepareRecovery();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage("Password updated successfully. Redirecting to login...");

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#fbe3b9] via-[#edd0ac] to-[#fbe3b9]" />

      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-[620px]">
          <div className="bg-white/90 backdrop-blur border border-black/10 rounded-3xl shadow-xl px-6 sm:px-10 py-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#4f252a] text-center">
              Create New Password
            </h1>

            <p className="text-center text-[#4f252a]/70 mt-3 mb-6 text-sm sm:text-base">
              Enter your new password below.
            </p>

            {!ready ? (
              <p className="text-center text-[#4f252a] font-medium">Loading...</p>
            ) : (
              <>
                {errorMessage && (
                  <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm sm:text-base text-red-700">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm sm:text-base text-green-700">
                    {successMessage}
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-[#4f252a]">
                      New Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-black/15 rounded-2xl px-5 py-3 pr-14 text-base outline-none focus:ring-2 focus:ring-[#e06464]/30 bg-white"
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-lg opacity-80 hover:opacity-100 transition"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-[#4f252a]">
                      Confirm New Password
                    </label>

                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-black/15 rounded-2xl px-5 py-3 pr-14 text-base outline-none focus:ring-2 focus:ring-[#e06464]/30 bg-white"
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-lg opacity-80 hover:opacity-100 transition"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-12 py-3 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-[#e06464] to-[#f1745e] shadow-lg disabled:opacity-60"
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}