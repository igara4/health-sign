"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { getUserQuestions, saveUserResponses } from "@/lib/api/condition"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

//ユーザーが登録した質問を取得
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

        const userId = userData.user.id
        const today = new Date().toISOString().split("T")[0]

        //チェックされた質問ID配列
        const checkedIds = Object.keys(data).filter((key)=>data[key]===true)

        //全質問のID(stateから取得)
        const allIds = questions.map((q)=>q.id)

        //チェックされた質問IDを取得
        const success = await saveUserResponses(userId,data)
        if(!success){
            alert("データを保存に失敗しました")
            return
        }

        alert("データを保存しました")
        reset()
        router.push("/")
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