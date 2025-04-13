import { createClient } from "@/utils/supabase/client"

//ノートを取得する
export const getNoteByLogId = async(userId:string)=>{
    const supabase = await createClient()

    const {data,error} = await supabase
        .from("logs")
        .select("note")
        .eq("user_id",userId)
        .single()

    if(error){
        console.error("ノートの取得に失敗しました",error.message)
        return ""
    }

    return data?.note || ""
}
