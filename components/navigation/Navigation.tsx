"use client"

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import Link from "next/link"
import { useRouter } from "next/navigation";

type NavigationProps = {
    user: User | null; // ユーザー情報を受け取れるように型定義
  };

// ナビゲーション
const Navigation = ({user}:NavigationProps) => {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout =async () =>{
        if(!window.confirm("ログアウトしますが、よろしいですか？")){
            return
        }

        await supabase.auth.signOut()
        router.push("/auth/login")
        router.refresh()

    }
  return (
    <header className="border-b">
      <div className="mx-auto max-w-screen-lg px-2 py-5 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Health Sign
        </Link>
      </div>
      <div className="text-sm font-bold">
          {user ? (
            <div className="flex items-center space-x-5">
              <Link href="/conditions/create">
                <div>記録する</div>
              </Link>

              <Link href="/settings/profile">
                <div>設定</div>
              </Link>

              <div className="cursor-pointer" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-5">
              <Link href="/auth/login">ログイン</Link>
              <Link href="/auth/signup">サインアップ</Link>
            </div>
          )}
        </div>
    </header>
  )
}

export default Navigation