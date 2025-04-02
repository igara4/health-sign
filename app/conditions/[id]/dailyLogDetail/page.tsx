import { deleteLog } from "@/app/actions/deleteLog"
import { formatToJST } from "@/lib/utils"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export default async function DailyLogDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: responses } = await supabase
        .from("responses")
        .select("question_id,answer,created_at,question:question_id(text,category)")
        .eq("log_id", params.id) as {data:any[]}

        console.log("🔍 responses:", responses)


        const scoreMap: Record<string, number> = {
            good: 2,
            warning: -1,
            bad: -2,
        }
        
        let score = 0
        const signs: string[] = []
        let datetime = ""
        
        for (const res of responses || []) {
            if (!res.answer) continue
            if (!res.question) continue
        
            signs.push(res.question.text)
            score += scoreMap[res.question.category] || 0
            datetime = res.created_at

            if(!datetime){
                datetime =res.created_at
            }
        }

    return (
        <div className="max-w-xl mx-auto mt-10">
            <h1 className="text-lg font-bold mb-4">記録の詳細</h1>
        
            <div className="text-sm text-gray-500">
                {datetime? formatToJST(datetime):"不明な日時"}
            </div>
        
            <div className="mt-2 text-sm">
                <span className="font-bold">✔️ サイン:</span>{" "}
                {signs.length > 0 ? signs.join(" / ") : "なし"}
            </div>
        
            <div className="mt-1 text-sm">
                <span className="font-bold">📈 スコア:</span>{" "}
                <span className={score < 0 ? "text-red-600" : "text-green-600"}>
                    {score}
                </span>
            </div>
            <div className="flex justify-end mt-6 space-x-4">
            <a
                href={`/conditions/${params.id}/edit`}
                className="px-4 py-2  bg-blue-600 text-sm text-white rounded hover:bg-blue-700 transition"
            >
                編集    
            </a>
            <form action={deleteLog.bind(null,params.id)}>
            <button 
                type="submit" 
                className="px-4 py-2 bg-red-600 text-sm text-white rounded hover:bg-red-700 transition">
                削除
            </button>
            </form>
            
            </div>
            <a
                href="/"
                className="px-4 py-2 bg-gray-300 text-sm text-gray-800 rounded hover:bg-gray-400 transition"
            >
                戻る
            </a>
        </div>
    )
}
