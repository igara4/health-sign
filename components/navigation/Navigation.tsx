"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Edit2Icon, LineChartIcon, LogOut, PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
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
} from "../ui/alert-dialog";

type NavigationProps = {
  user: User | null; // ユーザー情報を受け取れるように型定義
};

// ナビゲーション
const Navigation = ({ user }: NavigationProps) => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };
  return (
    <header className="border-b">
      <div className="mx-auto max-w-screen-lg px-2 pt-4 pb-2">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-4xl block mb-10"
        >
          <LineChartIcon className="w-8 h-8 text-teal-500" />
          Health Sign
        </Link>

        <div className="text-sm font-bold mt-5">
          {user ? (
            <div className="flex items-center justify-end space-x-2">
              <nav className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  asChild
                  className="hover:bg-gray-200 px-2 rounded"
                >
                  <Link href="/conditions/signs">
                    <Edit2Icon />
                    サインを編集
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-teal-500 hover:bg-teal-600 text-white px-2 rounded"
                >
                  <Link
                    href="/conditions/create"
                    className="flex items-center gap-2"
                  >
                    <PlusCircleIcon />
                    記録する
                  </Link>
                </Button>
              </nav>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:bg-gray-200 px-2 py-2"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>ログアウトしますか？</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      ログアウト
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
