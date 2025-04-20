"use server";

import {
  LoginSchema,
  PasswordSchema,
  ResetPasswordSchema,
  SignupSchema,
} from "@/schemas";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

export const signup = async (value: z.infer<typeof SignupSchema>) => {
  try {
    const supabase = await createClient();

    //アカウント作成
    const { data, error: signupError } = await supabase.auth.signUp({
      email: value.email,
      password: value.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/signup/verify`,
        data: {
          name: value.name,
        },
      },
    });

    if (data && data.user) {
      if (data.user.identities && data.user.identities.length > 0) {
        console.log("アカウントを作成しました");
      } else {
        return {
          error:
            "このメールアドレスは既に登録されています。他のメールアドレスを使用してください",
        };
      }
    } else {
      return { error: signupError?.message };
    }

    //プロフィールの名前を更新
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ name: value.name })
      .eq("id", data.user.id);

    if (updateError) {
      return { error: updateError.message };
    }
  } catch (err) {
    console.error(err);
    return { error: "エラーが発生しました" };
  }
};

export const login = async (value: z.infer<typeof LoginSchema>) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      ...value,
    });

    if (error) {
      return { error: error.message };
    }
  } catch (err) {
    console.error(err);
    return { error: "エラーが発生しました" };
  }
};

export const resetPassword = async (
  value: z.infer<typeof ResetPasswordSchema>
) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(value.email, {
      redirectTo: `{process.env.NEXTPUBLIC_APP_URL}/reset-password/confirm`,
    });

    if (error) {
      return { error: error.message };
    }
  } catch (err) {
    console.error(err);
    return { error: "エラーが発生しました" };
  }
};

export const setPassword = async (value: z.infer<typeof PasswordSchema>) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password: value.password,
    });

    if (error) {
      return { error: error.message };
    }
  } catch (err) {
    console.error(err);
    return { error: "エラーが発生しました" };
  }
};
