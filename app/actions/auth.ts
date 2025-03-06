"use server"

import { LoginSchema, SignupSchema } from "@/schemas"
import { createClient } from "@/utils/supabase/server"
import { z } from "zod"



export const signup =async(value:z.infer<typeof SignupSchema>)=>{
    try{
        const supabase = await createClient()


        //アカウント作成
        const {data,error:signupError}= await supabase.auth.signUp({
            email:value.email,
            password:value.password,
            options:{
                emailRedirectTo:`${process.env.NEXT_PUBLIC_APP_URL}/auth/signup/verify`,
                data: {
                    name: value.name
                }
            }
        })

        if(data&&data.user){
            if(data.user.identities&&data.user.identities.length>0){
                console.log("アカウントを作成しました")
            }else{
                return{
                    error:"このメールアドレスは既に登録されています。他のメールアドレスを使用してください",
                }
            }
        }else{
            return{error:signupError?.message}
        }

        //プロフィールの名前を更新
        //updateではなくupsertが必要かも？？一旦保留
        const {error:updateError} = await supabase
            .from("profiles")
            .update({name:value.name})
            .eq("id",data.user.id)

        
        //エラーチェック
        if(updateError){
            return{error:updateError.message}
        }
    }catch(err){
        console.error(err)
        return {error:"エラーが発生しました"}
    }
}

//ログイン
export const login =async(value:z.infer<typeof LoginSchema>)=>{
    try{
        const supabase =await createClient()

        const {error}=await supabase.auth.signInWithPassword({
            ...value,
        })

        if(error){
            return{error:error.message}
        }
    }catch(err){
        console.error(err)
        return {error:"エラーが発生しました"}
    }
}