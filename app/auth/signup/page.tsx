import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Signup from "./Signup"



const SignupPage =async()=>{
    const supabase = await createClient()
    const {data} = await supabase.auth.getUser()
    const user = data?.user

    if(user){
        redirect("/")
    }


    return <Signup/>
}


export default SignupPage