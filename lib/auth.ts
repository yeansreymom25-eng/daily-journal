import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user ?? null;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export function getDisplayName(user: User | null) {
  if (!user) return "My Journal User";

  const fullName = user.user_metadata?.full_name;
  if (typeof fullName === "string" && fullName.trim()) {
    return fullName;
  }

  return user.email ?? "My Journal User";
}

export function getAvatarUrl(user: User | null) {
  if (!user) return "";

  const avatarUrl = user.user_metadata?.avatar_url;
  return typeof avatarUrl === "string" ? avatarUrl.trim() : "";
}
