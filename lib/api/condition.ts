"use server";

import { createClient } from "@/utils/supabase/server";
import { Question } from "../utils/groupQuestions";

//全ユーザーが使用できる質問を取得(サイン編集画面用)
export const getAllQuestions = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questions")
    .select("id,text,category");

  if (error) {
    console.error("質問の取得に失敗しました", error.message);
    return [];
  }
  return data || [];
};

//ユーザーが選んだ質問だけ取得(記録画面用)
type SelectedQuestionRow = {
  question: Question | Question[];
};

export const getUserSelectedQuestions = async (userId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_selected_questions")
    .select("question:questions(id,text,category)")
    .eq("user_id", userId);

  if (error) {
    console.error("選択済みサインの取得に失敗しました", error.message);
    return [];
  }

  return (data || []).map((row: SelectedQuestionRow) => {
    const question = Array.isArray(row.question)
      ? row.question[0]
      : row.question;
    return question;
  });
};

//サインを選んで保存する
export const saveUserSelectedSigns = async (
  userId: string,
  selectedQuestionIds: string[],
) => {
  const supabase = await createClient();
  //既存の質問をいったん削除
  await supabase.from("user_selected_questions").delete().eq("user_id", userId);

  const inserts = selectedQuestionIds.map((qid) => ({
    user_id: userId,
    question_id: qid,
  }));

  const { error } = await supabase
    .from("user_selected_questions")
    .insert(inserts);
  return !error;
};

//ユーザーの回答を保存する
export const saveUserResponses = async (
  userId: string,
  logId: string,
  responses: Record<string, boolean>,
) => {
  const supabase = await createClient();
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  const inserts = Object.entries(responses)
    .filter(([_, answer]) => answer === true)
    .map(([question_id]) => ({
      user_id: userId,
      question_id,
      answer: true,
      log_id: logId,
      created_at: jst.toISOString(),
    }));

  if (inserts.length === 0) {
    console.warn("チェックされたサインがありません");
    return false;
  }

  const { error } = await supabase.from("responses").insert(inserts);
  if (error) {
    console.error("回答の保存に失敗しました", error.message);
    return false;
  }
  return true;
};
