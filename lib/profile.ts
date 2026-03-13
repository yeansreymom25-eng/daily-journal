import { supabase } from "@/lib/supabase";

export const PROFILE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET || "avatars";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

function getFileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName) return fromName;

  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export function validateProfileImage(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Use a JPG, PNG, or WEBP image.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Profile image must be 2MB or smaller.");
  }
}

export async function uploadProfileImage(userId: string, file: File) {
  validateProfileImage(file);

  const extension = getFileExtension(file);
  const path = `${userId}/avatar.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(PROFILE_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(PROFILE_BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}
