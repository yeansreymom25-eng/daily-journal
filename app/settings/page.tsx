"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getCurrentUser, getDisplayName, signOutUser } from "@/lib/auth";

export default function SettingsPage() {
  const router = useRouter();

  const COLORS = {
    bg: "#edd0ac",
    top: "#4f252a",
    primary: "#f1745e",
    primaryHover: "#e06464",
    text: "#4f252a",
  };

  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);
      setDisplayName(getDisplayName(currentUser));
      setEmail(currentUser.email ?? "");
      setLoading(false);
    };

    loadUser();
  }, [router]);

  async function handleLogout() {
    try {
      await signOutUser();
      router.push("/login");
    } catch (error: any) {
      alert(error.message || "Logout failed.");
    }
  }

  async function handleSaveChanges() {
    setSaving(true);

    try {
      const payload: {
        data?: { full_name: string };
        email?: string;
      } = {
        data: {
          full_name: displayName,
        },
      };

      if (user?.email !== email) {
        payload.email = email;
      }

      const { error } = await supabase.auth.updateUser(payload);

      if (error) {
        throw error;
      }

      alert(
        user?.email !== email
          ? "Profile updated. Check your email to confirm the new email address."
          : "Profile updated successfully."
      );
    } catch (error: any) {
      alert(error.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    const newPassword = window.prompt("Enter your new password:");

    if (!newPassword) return;

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      alert("Password updated successfully.");
    } catch (error: any) {
      alert(error.message || "Failed to change password.");
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase.rpc("delete_current_user");

      if (error) {
        throw error;
      }

      await supabase.auth.signOut();
      alert("Your account has been deleted.");
      router.push("/signup");
    } catch (error: any) {
      alert(error.message || "Failed to delete account.");
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <header className="w-full border-b shadow-md" style={{ backgroundColor: COLORS.top }}>
        <div className="w-full px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="text-white text-base sm:text-lg font-semibold">
            ← Back
          </button>

          <button
            className="px-4 sm:px-5 py-2 rounded-lg text-white font-bold text-sm sm:text-base"
            style={{ backgroundColor: COLORS.primary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.primary;
            }}
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 sm:mb-10 text-center" style={{ color: COLORS.text }}>
          Settings
        </h1>

        <div className="bg-white rounded-2xl shadow-lg border p-6 sm:p-10 w-full max-w-2xl">
          <p className="text-gray-600 mb-8 text-center text-sm sm:text-base">
            Manage your account preferences.
          </p>

          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-800">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1745e]"
            />
          </div>

          <div className="mb-8">
            <label className="block mb-2 font-semibold text-gray-800">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1745e]"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="px-6 py-3 rounded-lg text-white font-bold disabled:opacity-60"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary;
              }}
              onClick={handleSaveChanges}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              className="px-6 py-3 rounded-lg font-bold border"
              style={{
                backgroundColor: "#fbf3b9",
                color: COLORS.text,
                borderColor: COLORS.text,
              }}
              onClick={handleChangePassword}
            >
              Change Password
            </button>

            <button
              className="px-6 py-3 rounded-lg font-bold border border-red-400 text-red-600"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}