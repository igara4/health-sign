"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { getAllQuestions } from "@/lib/api/condition"
import { categoryLabel, categoryOrder, groupedQuestionsByCategory,Question } from "@/lib/utils/groupQuestions"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

type Props ={
    logId:string
}

const EditLogPageClient = ({logId}:Props) => {
    const router = useRouter()
    const {control,handleSubmit,reset} = useForm()
    const [questions,setQuestions] = useState<Question[]>([])
    const [initialAnswers,setInitialAnswers] = useState<Record<string,boolean>>({})
    const supabase = createClient()

  //質問&過去回答を取得
    useEffect(()=>{
        const fetchData = async()=>{
        const {data:userData} = await supabase.auth.getUser()
        if(!userData?.user) return

        const userId = userData.user.id
        const qRes = await getAllQuestions()
        setQuestions(qRes)

        const {data:responses} = await supabase
            .from("responses")
            .select("question_id,answer")
            .eq("log_id",logId)

        const initialData:Record<string,boolean> ={}
        for (const res of responses || []){
            initialData[res.question_id] = res.answer
        }

        setInitialAnswers(initialData)
        reset(initialData)
        }

        fetchData()
    },[logId,reset,supabase])

    //更新処理
    const onSubmit = async(data:any)=>{
        const {data:userData} = await supabase.auth.getUser()
        if(!userData?.user)return

        const now = new Date()
        const jst = new Date(now.getTime()+9*60*60*1000)

        //一旦元のresponsesを全削除？
        await supabase.from("responses").delete().eq("log_id",logId)

        //新しい内容をinsert
        const inserts = Object.entries(data)
        .filter(([_,answer])=> answer === true)
        .map(([question_id])=>({
            user_id:userData.user.id,
            question_id,
            answer:true,
            log_id:logId,
            created_at:jst.toISOString()
        }))

        if(inserts.length>0){
            const {error} = await supabase.from("responses").insert(inserts)
            if(error){
                alert("更新に失敗しました")
                return
                }
            }

            alert("更新しました")
            router.push(`/conditions/${logId}/dailyLogDetail`)
    }

        const groupedQuestions = groupedQuestionsByCategory(questions)
    


    return (
        <Card>
        <CardHeader>
            <CardTitle className="text-xl">記録を編集</CardTitle>
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
                                    defaultValue={initialAnswers[q.id] ||false}
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
                <Button type="submit" className="w-full">更新する</Button>
            </form> 
        </CardContent>
    </Card>
    )
}

export default EditLogPageClient