import { createClient } from "@/utils/supabase/server";
import "./globals.css";
import { Inter } from "next/font/google";
import ToastProvider from "@/components/providers/ToastProvider";
import Navigation from "@/components/navigation/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Health Sign",
  description: "Health Sign",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Navigation user={user} />
        <ToastProvider />
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 container max-w-screen-sm mx-auto px-1 py-5">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
