export type Response = {
  question_id: string;
  answer: boolean;
  created_at: string;
  question: {
    text: string;
    category: "good" | "warning" | "bad" | string;
  };
};
