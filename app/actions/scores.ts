"use server";

import getUserDailyScores from "@/lib/api/getUserDailyScores";

export const fetchUserScores = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return await getUserDailyScores(userId); //{date,score}
};
