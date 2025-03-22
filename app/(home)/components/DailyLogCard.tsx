"use client"

import Link from "next/link";


type Props={
    date:string;
    signs:string[];
    score:number;
}


const DailyLogCard = ({date,signs,score}:Props) => {
    return (
        <div className="border rounded-md p-4 shadow-sm hover:shadow transition">
            <div className="text-sm text-gray-500">{date}</div>

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

            <div className="mt-2 text-right">
                <Link href={`/conditions/${date}/dailyLogDetail`} className="text-blue-600 text-sm hover:underline">
                    詳細を見る →
                </Link>
            </div>
        </div>
    )
}

export default DailyLogCard