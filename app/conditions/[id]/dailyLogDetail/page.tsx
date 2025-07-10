import { deleteLog } from "@/app/actions/deleteLog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

          <p>
            <span className="font-bold">📈 スコア:</span>{" "}
            <span className={score < 0 ? "text-red-600" : "text-green-600"}>
              {score}
            </span>
          </p>
          <div>
            <p className="font-bold">📒 ノート:</p>
            <div className="mt-1 bg-gray-50 rounded-md p-3">
              {logData?.note || "ノートはありません"}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between flex wrap gap-2">
          <div className="flex gap-2">
            <Link
              href={`/conditions/${id}/edit`}
              className="px-4 py-2  bg-teal-500 text-sm text-white rounded hover:bg-teal-600"
            >
              編集
            </Link>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="px-4 py-2 bg-white text-sm text-red-500 border border-red-500 rounded hover:bg-red-400 hover:text-white"
                >
                  削除
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                  <AlertDialogDescription>
                    ※一度削除すると元に戻せませんのでご注意ください。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <form action={deleteLog.bind(null, id)}>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <button className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                        削除する
                      </button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-300 text-sm text-gray-800 rounded hover:bg-gray-400"
          >
            戻る
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
