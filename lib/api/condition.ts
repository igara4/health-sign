"use server"

import { createClient } from "@/utils/supabase/server"
import { object } from "zod"


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
    //チェックされた質問のみinsert
    const inserts = Object.entries(responses)
        .filter(([_,answer])=>answer ===true)
        .map(([question_id])=>({
            user_id:userId,
            question_id,
            answer:true,
            created_at:new Date().toISOString()
        }))

          // デバッグ用：実際に保存しようとしてる内容
            console.log("🟡 保存するデータ:", inserts)

        if(inserts.length === 0){
            console.warn("チェックされたサインがありません")
            return false
        }

        const {error} =await supabase.from("responses").insert(inserts)
        if(error){
            console.error("回答の保存に失敗しました",error.message)
            return false
        }
        return true

}