import { z } from "zod"

export const SignupSchema = z.object({
    name: z.string().min(1, {
        message: "お名前を入力してください",
    }),
    email: z.string().email({
        message: "メールアドレスを入力してください",
    }),
    password: z.string().min(8, {
        message: "英数字8文字以上で入力してください",
    }),
})

export const LoginSchema= z.object({
    email: z.string().email({
        message: "メールアドレスを入力してください",
    }),
    password: z.string().min(8, {
        message: "英数字8文字以上で入力してください",
    }),
})
