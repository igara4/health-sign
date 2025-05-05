import { createClient } from "@/utils/supabase/server";
import { formatToJST } from "../utils";

const getUserDailyScores = async (userId: string) => {
  const supabase = await createClient();

  const { data: responses, error } = await supabase
    .from("responses")
    .select("question_id,answer,created_at,log_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("データ取得エラー", error.message);
    return [];
  }

  const { data: questions } = await supabase
    .from("questions")
    .select("id,category");

  if (!questions) return [];

  const scoreMap: Record<string, number> = {
    good: +2,
    warning: -1,
    bad: -2,
  };

  const groupedByDate: Record<string, { score: number; logId: string }> = {};

  responses.forEach((response) => {
    const fullDateStr = formatToJST(response.created_at);
    const date = fullDateStr.split(" ")[0]; //YYYY-MM-DDのみ取得
    const question = questions.find((q) => q.id === response.question_id);

    if (!question || !response.answer) return;
    //チェックされていたらそのカテゴリのスコアを加算する
    if (!groupedByDate[date]) {
      groupedByDate[date] = {
        score: 0,
        logId: response.log_id,
      };
    }
    groupedByDate[date].score += scoreMap[question.category] || 0;
  });

  return Object.entries(groupedByDate).map(([date, { score, logId }]) => ({
    date,
    score,
    id: logId,
  }));
};

export default getUserDailyScores;
