import { createClient } from "@/utils/supabase/server";
import { fetchUserScores } from "../actions/scores";
import ChartClient from "./chart-client";


export default async function Home() {
  const supabase = await createClient()
  const {data:{user}} = await supabase.auth.getUser()
  
  if(!user){
    return <div>ログインが必要です</div>  
  }
  //server actionでデータ取得
  const scores = await fetchUserScores(user.id)

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-xl font-bold text-center">体調スコアの履歴</h2>

      {/*client componentにデータを渡す*/}
      <ChartClient scores={scores}/>
    </div>
  );
}
