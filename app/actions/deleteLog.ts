import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const deleteLog = async(logId:string) => {
    const supabase = await createClient()

    const {error} = await supabase
        .from("responses")
        .delete()
        .eq("log_id",logId)

    if(error){
        console.error("削除に失敗しました",error)
        return
    }

    console.log("削除に成功しました",logId)
    revalidatePath("/")
    redirect("/")


    
}