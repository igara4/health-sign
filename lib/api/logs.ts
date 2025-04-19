import { createClient } from "@/utils/supabase/server";
import { formatToJST } from "../utils";

export const getUserDailyLogs = async (userId: string) => {
  const supabase = await createClient();

  const { data: responses, error: resError } = await supabase
    .from("responses")
    .select("id,question_id,answer,created_at,log_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (resError || !responses) {
    console.error("回答取得エラー", resError?.message);
    return [];
  }
  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select("id,text,category")
    .eq("user_id", userId);

  if (qError || !questions) {
    console.error("質問取得エラー", qError?.message);
    return [];
  }

  const { data: logs, error: logError } = await supabase
    .from("logs")
    .select("id,note")
    .eq("user_id", userId);

  if (logError || !logs) {
    console.error("ノート取得エラー", logError?.message);
  }

  const scoreMap: Record<string, number> = {
    good: 2,
    warning: -1,
    bad: -2,
  };

  const grouped: Record<
    string,
    {
      datetime: string;
      signs: string[];
      score: number;
      log_id: string;
    }
  > = {};
  for (const res of responses) {
    if (!res.answer) continue;

    const groupKey = res.log_id; //グルーピングに使う
    const datetime = formatToJST(res.created_at); //UTCを実時間表示用に変換

    const question = questions.find((q) => q.id === res.question_id);
    if (!question) continue;

    if (!grouped[groupKey]) {
      grouped[groupKey] = { datetime, signs: [], score: 0, log_id: groupKey };
    }

    grouped[groupKey].signs.push(question.text);
    grouped[groupKey].score += scoreMap[question?.category] || 0;
  }

  const result = Object.entries(grouped)
    .map(([logId, { datetime, signs, score }]) => {
      const note = logs?.find((log) => log.id === logId)?.note ?? "";
      return {
        id: logId,
        datetime,
        signs,
        score,
        note,
      };
    })
    .sort(
      (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );

  return structuredClone(result);
};

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
