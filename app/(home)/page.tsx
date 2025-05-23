import { createClient } from "@/utils/supabase/server";
import { fetchUserScores } from "../actions/scores";
import ChartClient from "./chart-client";
import { getUserDailyLogs } from "@/lib/api/logs";
import DailyLogCard from "./components/DailyLogCard";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>ログインが必要です</div>;
  }
  //グラフ用スコアデータ取得
  const scores = await fetchUserScores(user.id);

  //日ごとのサイン＋スコアのログ
  const logs = await getUserDailyLogs(user.id);

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-xl font-bold text-center">最近の体調</h2>

      <ChartClient scores={scores} />

      <div>
        {logs.length === 0 ? (
          <p>体調記録がありません。サインを編集後、体調を記録してください。</p>
        ) : (
          logs.map((log) => (
            <DailyLogCard
              key={log.id}
              id={log.id}
              datetime={log.datetime}
              signs={log.signs}
              score={log.score}
              note={log.note}
            />
          ))
        )}
      </div>
    </div>
  );
}
