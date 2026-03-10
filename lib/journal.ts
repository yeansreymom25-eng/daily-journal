import { supabase } from "@/lib/supabase";

export type JournalEntry = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string;
  created_at: string;
  updated_at: string;
};

export type JournalDraft = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string;
  created_at: string;
  updated_at: string;
};

export async function getEntries() {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as JournalEntry[];
}

export async function getDrafts() {
  const { data, error } = await supabase
    .from("journal_drafts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as JournalDraft[];
}

export async function getEntryById(id: string) {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as JournalEntry;
}

export async function getDraftById(id: string) {
  const { data, error } = await supabase
    .from("journal_drafts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as JournalDraft;
}

export async function createEntry(payload: {
  user_id: string;
  title: string;
  content: string;
  mood: string;
}) {
  const { data, error } = await supabase
    .from("journal_entries")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as JournalEntry;
}

export async function updateEntry(
  id: string,
  payload: {
    title: string;
    content: string;
    mood: string;
  }
) {
  const { data, error } = await supabase
    .from("journal_entries")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as JournalEntry;
}

export async function deleteEntry(id: string) {
  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function createDraft(payload: {
  user_id: string;
  title: string;
  content: string;
  mood: string;
}) {
  const { data, error } = await supabase
    .from("journal_drafts")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as JournalDraft;
}

export async function updateDraft(
  id: string,
  payload: {
    title: string;
    content: string;
    mood: string;
  }
) {
  const { data, error } = await supabase
    .from("journal_drafts")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as JournalDraft;
}

export async function deleteDraft(id: string) {
  const { error } = await supabase
    .from("journal_drafts")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function publishDraft(id: string) {
  const draft = await getDraftById(id);

  const createdEntry = await createEntry({
    user_id: draft.user_id,
    title: draft.title,
    content: draft.content,
    mood: draft.mood,
  });

  await deleteDraft(id);

  return createdEntry;
}