"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { getUserQuestions, saveUserResponses } from "@/lib/api/condition"
import { categoryLabel, categoryOrder, groupedQuestionsByCategory, Question } from "@/lib/utils/groupQuestions"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

//ユーザーが登録した質問を取得
const editSignsPage = () => {
    const router = useRouter()
    const {control,handleSubmit,reset} = useForm()
    const [questions,setQuestions] =useState<Question[]>([])
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

    const onSubmit = async (data:any) =>{
        const {data:userData} = await supabase.auth.getUser()
        if(!userData?.user) return

        const userId = userData.user.id


        const success = await saveUserResponses(userId,data)
        if(!success){
            alert("")
            return
        }

        alert("")
        reset()
        router.push("/")
    }

    const groupedQuestions = groupedQuestionsByCategory(questions)



    return (
        <>
            <Card className="max-w-md mx-auto mt-10">
                <CardHeader>
                    <CardTitle className="text-xl">体調をチェック</CardTitle>
                    <CardDescription>当てはまるサインにチェックをしてください</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {categoryOrder.map((category)=>(
                            <div key={category}>
                                <h3 className="text-md font-bold mb-2">{categoryLabel[category]}</h3>
                                <div className="space-y-2">
                                    {groupedQuestions[category]?.map((q)=>(
                                        <Controller
                                            key={q.id}
                                            name={q.id}
                                            control={control}
                                            defaultValue={false}
                                            render={({field})=>(
                                            <div  className="flex items-center space-x-3">
                                                <Checkbox
                                                    id={q.id}
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                                <label htmlFor={q.id} className="text-sm">{q.text}</label>
                                            </div>
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                        <Button type="submit" className="w-full">記録</Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default editSignsPage