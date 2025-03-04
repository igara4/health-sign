"use client"

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
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
        router.push("/login")
        router.refresh()

    }
  return (
    <header className="border-b">
      <div className="mx-auto max-w-screen-lg px-2 py-5 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Health Sign
        </Link>
      </div>
    </header>
  )
}

export default Navigation