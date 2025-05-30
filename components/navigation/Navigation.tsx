"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Edit2Icon, LineChartIcon, LogOut, PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type NavigationProps = {
  user: User | null; // ユーザー情報を受け取れるように型定義
};

// ナビゲーション
const Navigation = ({ user }: NavigationProps) => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    if (!window.confirm("ログアウトしますが、よろしいですか？")) {
      return;
    }

    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };
  return (
    <header className="border-b">
      <div className="mx-auto max-w-screen-lg px-2 py-5">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-3xl block mb-2"
        >
          <LineChartIcon className="w-6 h-6 text-teal-500" />
          Health Sign
        </Link>

        <div className="text-sm font-bold mt-5">
          {user ? (
            <div className="flex items-center justify-end space-x-5">
              <nav className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/conditions/signs">
                    <Edit2Icon className="w-4 h-4 mr-2" />
                    サインを編集
                  </Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
                >
                  <Link
                    href="/conditions/create"
                    className="flex items-center gap-2"
                  >
                    <PlusCircleIcon className="w-4 h-4 mr-2" />
                    記録する
                  </Link>
                </Button>
              </nav>

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
      </div>
    </header>
  );
};

export default Navigation;
