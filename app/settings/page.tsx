"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { ArrowLeft, Camera, LogOut, UserCircle2 } from "lucide-react";
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
    top: "#4f252a",
    primary: "#f1745e",
    primaryHover: "#df624f",
    side: "#f9efbc",
    text: "#4f252a",
    textSoft: "#7d5953",
    panel: "#fffaf4",
    panelSoft: "rgba(255,250,244,0.78)",
    border: "rgba(79,37,42,0.14)",
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

      if (error) throw error;

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

      if (error) throw error;

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

      if (error) throw error;

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

      if (error) throw error;

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
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6 md:px-8 lg:px-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-base font-semibold text-white sm:text-lg"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition"
            style={{ backgroundColor: COLORS.primary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.primary;
            }}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        <div className="w-full max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-black sm:text-5xl md:text-6xl" style={{ color: COLORS.text }}>
              Settings
            </h1>
            <p className="mt-3 text-sm sm:text-base" style={{ color: COLORS.textSoft }}>
              Manage your profile, password, and account preferences.
            </p>
          </div>

          <div
            className="rounded-[32px] border p-6 shadow-[0_28px_70px_rgba(79,37,42,0.10)] sm:p-10"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border }}
          >
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
                style={{ borderColor: "rgba(241,116,94,0.25)", backgroundColor: COLORS.side }}
              >
                {avatarUrl.trim() ? (
                  <img src={avatarUrl} alt="Profile preview" className="h-full w-full object-cover" />
                ) : (
                  <UserCircle2 size={72} color={COLORS.text} />
                )}
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold" style={{ color: COLORS.text }}>
                <Camera size={16} />
                Profile photo preview
              </div>
              <label
                className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-full px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
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
              <p className="mt-2 text-center text-sm" style={{ color: COLORS.textSoft }}>
                Upload a JPG, PNG, or WEBP image up to 2MB.
              </p>
            </div>

            <div className="mb-6">
              <label className="mb-2 block font-semibold" style={{ color: COLORS.text }}>
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-2xl border bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f1745e]"
                style={{ borderColor: COLORS.border, color: COLORS.text }}
              />
            </div>

            <div className="mb-8">
              <label className="mb-2 block font-semibold" style={{ color: COLORS.text }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f1745e]"
                style={{ borderColor: COLORS.border, color: COLORS.text }}
              />
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button
                className="rounded-full px-6 py-3 font-bold text-white disabled:opacity-60"
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
                className="rounded-full border px-6 py-3 font-bold"
                style={{
                  backgroundColor: COLORS.panelSoft,
                  color: COLORS.text,
                  borderColor: COLORS.border,
                }}
                onClick={openPasswordModal}
                disabled={saving || uploadingAvatar || changingPassword || deletingAccount}
              >
                Change Password
              </button>

              <button
                className="rounded-full border border-red-400 px-6 py-3 font-bold text-red-600"
                onClick={openDeleteModal}
                disabled={saving || uploadingAvatar || changingPassword || deletingAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div
            className="w-full max-w-md rounded-[28px] border p-6 shadow-2xl"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border }}
          >
            <h2 className="mb-3 text-2xl font-extrabold text-[#4f252a]">Change Password</h2>
            <p className="mb-4 text-[#4f252a]/75">Enter your new password below.</p>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="w-full rounded-2xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f1745e]"
              style={{ borderColor: COLORS.border }}
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword("");
                }}
                className="rounded-2xl border px-5 py-2 font-bold text-[#4f252a]"
                style={{ borderColor: COLORS.border }}
              >
                Cancel
              </button>

              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="rounded-2xl px-5 py-2 font-bold text-white disabled:opacity-60"
                style={{ backgroundColor: COLORS.primary }}
              >
                {changingPassword ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div
            className="w-full max-w-md rounded-[28px] border p-6 shadow-2xl"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border }}
          >
            <h2 className="mb-3 text-2xl font-extrabold text-[#4f252a]">Delete Account</h2>
            <p className="mb-5 text-[#4f252a]/75">
              Are you sure you want to delete your account? This cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-2xl border px-5 py-2 font-bold text-[#4f252a]"
                style={{ borderColor: COLORS.border }}
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="rounded-2xl px-5 py-2 font-bold text-white disabled:opacity-60"
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
