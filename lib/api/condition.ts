"use server"

import {v4 as uuidv4} from "uuid"
import { createClient } from "@/utils/supabase/server"


//ユーザーの質問を取得する
export const getUserQuestions =async(userId:string)=>{
    const supabase = await createClient()
    const {data,error} = await supabase
        .from("questions")
        .select("id,text,category")
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

    const logId = uuidv4()//回答事(サインまとめて)に毎回ユニークログIDを生成

    const now = new Date()
    const jst = new Date(now.getTime()+9*60*60*1000)//保存のときにもJSTに変換

    const inserts = Object.entries(responses)
        .filter(([_,answer])=>answer ===true)
        .map(([question_id])=>({
            user_id:userId,
            question_id,
            answer:true,
            log_id:logId,
            created_at:jst.toISOString()
        }))

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