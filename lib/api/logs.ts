import { createClient } from "@/utils/supabase/server"


export const getUserDailyLogs =async(userId:string)=>{
    const supabase = await createClient()

    //回答一覧(responses)取得
    const {data:responses,error:resError} = await supabase
        .from("responses")
        .select("question_id,answer,created_at")
        .eq("user_id",userId)

    if(resError||!responses){
        console.error("回答取得エラー",resError?.message)
        return []
    }

    //質問一覧(questions)取得
    const{data:questions,error:qError} = await supabase
        .from("questions")
        .select("id,text,category")
        .eq("user_id",userId)

        if(qError||!questions){
            console.error("質問取得エラー",qError?.message)
            return[]
        }
        //スコア定義※getDailyScoreにもあるからリファクタしたい
        const scoreMap:Record<string,number>={
            good:2,
            warning:-1,
            bad:-2
        }

        const grouped:Record<string,{signs:string[]; score:number}>={}

        for(const res of responses){
            if(!res.answer) continue

            const date =res.created_at.split("T")[0]
            const question = questions.find((q)=>q.id === res.question_id)
            if(!question) continue

            if(!grouped[date]){
                grouped[date] = {signs:[],score:0}
            }

            grouped[date].signs.push(question.text)
            grouped[date].score += scoreMap[question.category]||0
        }

        //配列にして日付降順で返す
        return Object.entries(grouped).map(([date,{signs,score}])=>({
            date,signs,score
        }))
        .sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime())
}