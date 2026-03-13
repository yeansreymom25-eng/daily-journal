"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Camera, UserCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getAvatarUrl, getCurrentUser, getDisplayName, signOutUser } from "@/lib/auth";
import { PROFILE_BUCKET, uploadProfileImage } from "@/lib/profile";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function SettingsPage() {
  const router = useRouter();

  const COLORS = {
    bg: "#edd0ac",
    top: "#4f252a",
    primary: "#f1745e",
    primaryHover: "#e06464",
    side: "#fbf3b9",
    text: "#4f252a",
  };

  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

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
      setAvatarUrl(getAvatarUrl(currentUser));
      setLoading(false);
    };

    loadUser();
  }, [router]);

  async function handleLogout() {
    try {
      await signOutUser();
      router.push("/login");
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Logout failed."));
    }
  }

  async function handleSaveChanges() {
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload: {
        data?: { full_name: string; avatar_url: string };
        email?: string;
      } = {
        data: {
          full_name: displayName,
          avatar_url: avatarUrl.trim(),
        },
      };

      if (user?.email !== email) {
        payload.email = email;
      }

      const { error } = await supabase.auth.updateUser(payload);

      if (error) {
        throw error;
      }

      setUser((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          email,
          user_metadata: {
            ...prev.user_metadata,
            full_name: displayName,
            avatar_url: avatarUrl.trim(),
          },
        };
      });

      setSuccessMessage(
        user?.email !== email
          ? "Profile updated. Check your email to confirm the new email address."
          : "Profile updated successfully."
      );
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Failed to save changes."));
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const uploadedAvatarUrl = await uploadProfileImage(user.id, file);

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: displayName,
          avatar_url: uploadedAvatarUrl,
        },
      });

      if (error) {
        throw error;
      }

      setAvatarUrl(uploadedAvatarUrl);
      setUser((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          user_metadata: {
            ...prev.user_metadata,
            full_name: displayName,
            avatar_url: uploadedAvatarUrl,
          },
        };
      });
      setSuccessMessage("Profile photo updated successfully.");
    } catch (error: unknown) {
      setErrorMessage(
        getErrorMessage(
          error,
          `Failed to upload profile photo. Make sure the '${PROFILE_BUCKET}' storage bucket exists and is public.`
        )
      );
    } finally {
      setUploadingAvatar(false);
      event.target.value = "";
    }
  }

  function openPasswordModal() {
    setErrorMessage("");
    setSuccessMessage("");
    setNewPassword("");
    setShowPasswordModal(true);
  }

  async function handleChangePassword() {
    if (!newPassword.trim()) {
      setErrorMessage("Please enter your new password.");
      return;
    }

    setChangingPassword(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      setShowPasswordModal(false);
      setNewPassword("");
      setSuccessMessage("Password updated successfully.");
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Failed to change password."));
    } finally {
      setChangingPassword(false);
    }
  }

  function openDeleteModal() {
    setErrorMessage("");
    setSuccessMessage("");
    setShowDeleteModal(true);
  }

  async function handleDeleteAccount() {
    setDeletingAccount(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { error } = await supabase.rpc("delete_current_user");

      if (error) {
        throw error;
      }

      await supabase.auth.signOut();
      router.push("/signup");
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Failed to delete account."));
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.bg }}>
        <header className="w-full h-[72px] border-b shadow-md flex items-center justify-end px-8 gap-4" style={{ backgroundColor: COLORS.top, borderColor: "#3a1b1f" }}>
          <div className="w-24 h-9 rounded-lg bg-white/20 animate-pulse" />
          <div className="w-24 h-9 rounded-lg bg-white/20 animate-pulse" />
          <div className="w-9 h-9 rounded-md bg-white/20 animate-pulse" />
        </header>
        <main className="flex-1 flex">
          <aside className="w-[340px] border-r" style={{ backgroundColor: COLORS.side, borderColor: "rgba(79,37,42,0.3)" }}>
            <div className="h-[240px] border-b flex flex-col items-center justify-center p-6 gap-4" style={{ borderColor: "rgba(79,37,42,0.3)" }}>
              <div className="w-[150px] h-[150px] rounded-full bg-black/5 animate-pulse" />
              <div className="w-40 h-8 rounded-lg bg-black/5 animate-pulse" />
            </div>
            <div className="p-6 space-y-3">
              <div className="w-full h-14 rounded-lg bg-black/5 animate-pulse" />
              <div className="w-full h-14 rounded-lg bg-black/5 animate-pulse" />
              <div className="w-full h-14 rounded-lg bg-black/5 animate-pulse" />
            </div>
          </aside>
          <section className="flex-1 p-10">
            <div className="w-64 h-16 rounded-xl bg-black/5 animate-pulse mb-8" />
            <div className="w-full h-[400px] rounded-xl bg-white border animate-pulse" style={{ borderColor: "rgba(79,37,42,0.25)" }} />
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: COLORS.bg }}>
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
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 sm:mb-10 text-center"
          style={{ color: COLORS.text }}
        >
          Settings
        </h1>

        <div className="bg-white rounded-2xl shadow-lg border p-6 sm:p-10 w-full max-w-2xl">
          <p className="text-gray-600 mb-8 text-center text-sm sm:text-base">
            Manage your account preferences.
          </p>

          {errorMessage && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              {successMessage}
            </div>
          )}

          <div className="mb-8 flex flex-col items-center">
            <div
              className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4"
              style={{ borderColor: "rgba(241,116,94,0.25)", backgroundColor: "#fbf3b9" }}
            >
              {avatarUrl.trim() ? (
                <img
                  src={avatarUrl}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserCircle2 size={72} color={COLORS.text} />
              )}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold" style={{ color: COLORS.text }}>
              <Camera size={16} />
              Profile photo preview
            </div>
            <label
              className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-lg px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
              style={{ backgroundColor: COLORS.primary }}
            >
              {uploadingAvatar ? "Uploading..." : "Upload Photo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={uploadingAvatar || saving || changingPassword || deletingAccount}
              />
            </label>
            <p className="mt-2 text-center text-sm text-gray-500">
              Upload a JPG, PNG, or WEBP image up to 2MB.
            </p>
          </div>

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

          <div className="mb-8">
            <label className="block mb-2 font-semibold text-gray-800">
              Profile Picture URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/your-photo.jpg"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1745e]"
            />
            <p className="mt-2 text-sm text-gray-500">
              Optional fallback if you prefer using an external image link.
            </p>
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
              disabled={saving || uploadingAvatar || changingPassword || deletingAccount}
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
              onClick={openPasswordModal}
              disabled={saving || uploadingAvatar || changingPassword || deletingAccount}
            >
              Change Password
            </button>

            <button
              className="px-6 py-3 rounded-lg font-bold border border-red-400 text-red-600"
              onClick={openDeleteModal}
              disabled={saving || uploadingAvatar || changingPassword || deletingAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border p-6">
            <h2 className="text-2xl font-extrabold text-[#4f252a] mb-3">
              Change Password
            </h2>
            <p className="text-[#4f252a]/75 mb-4">
              Enter your new password below.
            </p>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1745e]"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword("");
                }}
                className="px-5 py-2 rounded-lg font-bold border text-[#4f252a]"
              >
                Cancel
              </button>

              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="px-5 py-2 rounded-lg font-bold text-white disabled:opacity-60"
                style={{ backgroundColor: COLORS.primary }}
              >
                {changingPassword ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border p-6">
            <h2 className="text-2xl font-extrabold text-[#4f252a] mb-3">
              Delete Account
            </h2>
            <p className="text-[#4f252a]/75 mb-5">
              Are you sure you want to delete your account? This cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 rounded-lg font-bold border text-[#4f252a]"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="px-5 py-2 rounded-lg font-bold text-white disabled:opacity-60"
                style={{ backgroundColor: "#dc2626" }}
              >
                {deletingAccount ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
