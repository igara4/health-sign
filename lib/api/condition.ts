"use server"

import { createClient } from "@/utils/supabase/server"


//ユーザーの質問を取得する
export const getUserQuestions =async(userId:string)=>{
    const supabase = await createClient()
    const {data,error} = await supabase
        .from("questions")
        .select("id,text")
        .eq("user_id",userId)
    
        if(error){
            console.error("質問の取得に失敗しました",error.message)
            return []
        }
        return data || []
}

//ユーザーの回答を保存する
export const saveUserResponses=async(userId:string,responses:Record<string,boolean>)=>{
    const supabase = await createClient()

    const formattedResponses = Object.entries(responses).map(([question_id,answer])=>({
        user_id:userId,
        question_id,
        answer:!!answer
        }))
        //デバッグ用
        console.log("保存するデータ:", formattedResponses)

        const {error} =await supabase.from("responses").insert(formattedResponses)
        if(error){
            console.error("回答の保存に失敗しました",error.message)
            return false
        }
        return true

}