import { createClient } from "@/utils/supabase/server"


export const getUserDailyLogs =async(userId:string)=>{
    const supabase = await createClient()

    //回答一覧(responses)取得
    const {data:responses,error:resError} = await supabase
        .from("responses")
        .select("id,question_id,answer,created_at")
        .eq("user_id",userId)
        .order("created_at",{ascending:false})

    if(resError||!responses){
        console.error("回答取得エラー",resError?.message)
        return []
    }
    console.log("responsesの中身", responses)

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

        const logs = responses
            .filter((res)=>res.answer === true)
            .map((res)=>{
                const question = questions.find((q)=>q.id === res.question_id)
                if(!question) return null

                return{
                    id:res.id,
                    datetime:res.created_at,
                    signs:[question.text],
                    score:scoreMap[question.category]
                }
            })
            .filter((log)=> log !== null)

        return logs
            
}