import { deleteLog } from "@/app/actions/deleteLog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Response } from "@/lib/types/response";
import { formatToJST } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DailyLogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: logData } = await supabase
    .from("logs")
    .select("note")
    .eq("id", id)
    .single();

  const { data: rawData } = await supabase
    .from("responses")
    .select(
      "question_id,answer,created_at,log_id,question:question_id(text,category)"
    )
    .eq("log_id", id);

  const responses: Response[] = (rawData ?? []).map((res) => ({
    ...res,
    question: Array.isArray(res.question) ? res.question[0] : res.question,
  }));

  const scoreMap: Record<string, number> = {
    good: 2,
    warning: -1,
    bad: -2,
  };

  let score = 0;
  const signs: string[] = [];
  let datetime = "";

  for (const res of responses || []) {
    if (!res.answer) continue;
    if (!res.question) continue;

    const question = Array.isArray(res.question)
      ? res.question[0]
      : res.question;

    signs.push(question.text);
    score += scoreMap[question.category] || 0;
    datetime = res.created_at;

    if (!datetime) {
      datetime = res.created_at;
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">記録の詳細</CardTitle>
          <CardDescription>
            {datetime ? formatToJST(datetime) : "不明な日時"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          <p>
            <span className="font-bold">✔️ サイン:</span>{" "}
            {signs.length > 0 ? signs.join(" / ") : "なし"}
          </p>

          <div className="mt-1 text-sm">
            <span className="font-bold">📈 スコア:</span>{" "}
            <span className={score < 0 ? "text-red-600" : "text-green-600"}>
              {score}
            </span>
          </div>
          <div className="mt-4 text-sm">
            <span className="font-bold">📒 ノート:</span>
            <div className="ml-5">{logData?.note || "ノートはありません"}</div>
          </div>
        </CardContent>

        <div className="flex justify-end mt-6 space-x-4">
          <Link
            href={`/conditions/${id}/edit`}
            className="px-4 py-2  bg-blue-600 text-sm text-white rounded hover:bg-blue-700 transition"
          >
            編集
          </Link>
          <form action={deleteLog.bind(null, id)}>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-sm text-white rounded hover:bg-red-700 transition"
            >
              削除
            </button>
          </form>
        </div>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-300 text-sm text-gray-800 rounded hover:bg-gray-400 transition"
        >
          戻る
        </Link>
      </Card>
    </div>
  );
}
