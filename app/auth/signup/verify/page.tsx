"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SignupVerifyPage = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createClient();
    const code = searchParams.get("code");

    if (!code) {
      console.error("認証コードがURLにありません");
      return;
    }

    supabase.auth.exchangeCodeForSession(code).then(async ({ data, error }) => {
      if (error) {
        console.log("セッションエラー", error);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const name = localStorage.getItem("name");

      if (userData?.user && name) {
        const { error: upsertError } = await supabase.from("profiles").upsert({
          id: userData.user.id,
          name,
        });

        if (upsertError) {
          console.error("プロフィール登録エラー", upsertError);
        } else {
          console.log("プロフィール登録成功");
          localStorage.removeItem("name");
        }
      }
    });
  }, [searchParams]);

  return (
    <div className="w-[500px] bg-white p-5 rounded-xl border">
      <div className="text-primary text-xl font-bold text-center border-b border-black pb-5 mb-5 mt-3">
        アカウント本登録完了
      </div>

      <div className="text-sm text-center mb-5">
        アカウント本登録が完了しました。
      </div>

      <Button asChild className="w-full">
        <Link href="/">トップページ</Link>
      </Button>
    </div>
  );
};

export default SignupVerifyPage;
