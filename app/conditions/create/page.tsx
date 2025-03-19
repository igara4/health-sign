"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"


const questions = [
    {id:1,text:"最近よく疲れたと言っていませんか？"},
    {id:2,text:"夜よく眠れていますか？"},
    {id:3,text:"悲観的になりやすいですか？"}
]

const createConditionPage = () => {
    const {register,handleSubmit,watch} =useForm()
    const onSubmit =(data:any) =>{
        console.log("回答",data)
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
                                <Checkbox id={`q${q.id}`} {...register(`q${q.id}`)}/>
                                <label htmlFor={`q${q.id}`} className="text-sm">{q.text}</label>
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