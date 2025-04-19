import { createClient } from "@/utils/supabase/server";

const getUserDailyScores = async (userId: string) => {
  const supabase = await createClient();

  //ユーザーの回答データを日ごとに取得
  const { data: responses, error } = await supabase
    .from("responses")
    .select("question_id,answer,created_at")
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

  //カテゴリーごとのスコア設定
  const scoreMap: Record<string, number> = {
    good: +2,
    warning: -1,
    bad: -2,
  };

  //日ごとのスコア集計
  const dailyScores: Record<string, number> = {};

  responses.forEach((response) => {
    const date = response.created_at.split("T")[0]; //YYYY-MM-DDのみ取得
    const question = questions.find((q) => q.id === response.question_id);

    if (!question) return;
    //チェックされていたらそのカテゴリのスコアを加算する
    if (response.answer) {
      dailyScores[date] =
        (dailyScores[date] || 0) + (scoreMap[question.category] || 0);
    }
  });
  //日付とスコアのリストを返す
  return Object.entries(dailyScores).map(([date, score]) => ({ date, score }));
};

export default getUserDailyScores;
