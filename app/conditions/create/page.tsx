"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { getUserQuestions, saveUserResponses } from "@/lib/api/condition"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

//仮の質問リスト
const questions = [
    {id:1,text:"最近よく疲れたと言っていませんか？"},
    {id:2,text:"夜よく眠れていますか？"},
    {id:3,text:"悲観的になりやすいですか？"}
]

//ユーザーが登録した質問を取得※ユーザーが登録した質問は未作成のためコメントアウト
const createConditionPage = () => {
    const router =useRouter()
    const {register,handleSubmit,reset} =useForm()
    const [questions,setQuestions] = useState<{id:string; text:string}[]>([])
    const supabase = createClient()

    useEffect(()=>{
        const fetchQuestions = async()=>{
            const {data:userData} = await supabase.auth.getUser()
            if(!userData?.user) return
            const userQuestions = await getUserQuestions(userData.user.id)
            setQuestions(userQuestions)
        }

        fetchQuestions()
    },[])


    const onSubmit = async(data:any) =>{
        const{data:userData} = await supabase.auth.getUser()
        if(!userData?.user) return

        const success = await saveUserResponses(userData.user.id,data)
        if(success){
            alert("データを保存しました")
            reset()
            router.push("/")
        }else{
            alert("データを保存に失敗しました")
        }
    }
    return (
        <>
            <div>createConditionPage</div>
            <Card className="max-w-md mx-auto mt-10">
                <CardHeader>
                    <CardTitle>体調をチェック</CardTitle>
                    <CardDescription>当てはまるサインにチェックをしてください</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {questions.map((q)=>(
                            <div key={q.id} className="flex items-center space-x-3">
                                <Checkbox id={q.id} {...register(q.id)}/>
                                <label htmlFor={q.id} className="text-sm">{q.text}</label>
                            </div>
                        ))}
                        <Button type="submit" className="w-full">記録</Button>
                    </form>
                </CardContent>
            </Card>
        </>

        
    )
}

export default createConditionPage