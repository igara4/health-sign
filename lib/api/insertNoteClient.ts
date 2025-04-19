import { createClient } from "@/utils/supabase/client";

export const insertNote = async (userId: string, note: string) => {
  const supabase = await createClient();

  const safeNote = typeof note === "string" ? note : String(note ?? "");

  const { data, error } = await supabase
    .from("logs")
    .insert([{ user_id: userId, note: safeNote }])
    .select("id")
    .single();

  if (error) {
    console.error("ノート作成失敗", error.message);
    return null;
  }

  return typeof data?.id === "string" ? data.id : String(data?.id);
};
