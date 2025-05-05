export type Response = {
  question_id: string;
  answer: boolean;
  created_at: string;
  log_id: string;
  question: {
    text: string;
    category: "good" | "warning" | "bad" | string;
  };
};
