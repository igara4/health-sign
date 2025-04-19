export type Question = {
  id: string;
  text: string;
  category: "good" | "warning" | "bad";
};

export const groupedQuestionsByCategory = (questions: Question[]) => {
  return questions.reduce(
    (acc, q) => {
      if (!acc[q.category]) acc[q.category] = [];
      acc[q.category].push(q);
      return acc;
    },
    {} as Record<string, Question[]>
  );
};

//表示順を統一
export const categoryOrder = ["good", "warning", "bad"] as const;
export const categoryLabel: Record<string, string> = {
  good: "良好サイン",
  warning: "注意サイン",
  bad: "悪化サイン",
};
