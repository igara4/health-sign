import { createClient } from "@/utils/supabase/client";

//ノートを取得する
export const getNoteByLogId = async (logId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("logs")
    .select("note")
    .eq("id", logId)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("ノートの取得に失敗しました", error.message);
    return "";
  }

  return data?.note || "";
};
