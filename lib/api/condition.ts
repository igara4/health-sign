"use server";

import { createClient } from "@/utils/supabase/server";
import { Question } from "../utils/groupQuestions";

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

export const getDefaultQuestions = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("default_signs")
    .select("id,text,category");

  if (error) {
    console.error("デフォルトサイン(質問)の取得に失敗しました", error.message);
    return [];
  }
  return data || [];
};

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

  if (!data || data.length === 0) {
    return await getDefaultQuestions();
  }

  return (data || []).map((row: SelectedQuestionRow) => {
    const question = Array.isArray(row.question)
      ? row.question[0]
      : row.question;
    return question;
  });
};

export const initDefaultQuestions = async (userId: string) => {
  const supabase = await createClient();

  const { data: defaults, error: defaultError } = await supabase
    .from("default_signs")
    .select("text");

  if (defaultError || !defaults) {
    console.error("デフォルト質問の取得失敗", defaultError?.message);
    return [];
  }

  const selectedQuestions: string[] = [];

  for (const { text } of defaults) {
    const { data, error } = await supabase
      .from("questions")
      .select("id")
      .eq("text", text)
      .maybeSingle();

    if (data?.id) {
      selectedQuestions.push(data.id);
    } else {
      console.warn(`質問が見つかりません:${text}`);
    }
  }

  const inserts = selectedQuestions.map((question_id) => ({
    user_id: userId,
    question_id,
  }));

  const { error: insertError } = await supabase
    .from("user_selected_questions")
    .insert(inserts);

  if (insertError) {
    console.error("デフォルト質問の登録に失敗", insertError.message);
    return [];
  }

  return selectedQuestions;
};

export const saveUserSelectedSigns = async (
  userId: string,
  selectedQuestionIds: string[]
) => {
  const supabase = await createClient();
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

export const saveUserResponses = async (
  userId: string,
  logId: string,
  responses: Record<string, boolean>
) => {
  const supabase = await createClient();
  const now = new Date();

  const inserts = Object.entries(responses)
    .filter(([_, answer]) => answer === true)
    .map(([question_id]) => ({
      user_id: userId,
      question_id,
      answer: true,
      log_id: logId,
      created_at: now.toISOString(),
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
