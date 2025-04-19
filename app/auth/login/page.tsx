import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Login from "./Login";

const LoginPage = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (user) {
    redirect("/");
  }

  return <Login />;
};

export default LoginPage;
