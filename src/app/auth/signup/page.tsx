import { AuthForm } from "@/components/AuthForm"
import { createClient } from "@/lib/supabase/api"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/bookmarks");
  }
  return <AuthForm type="signup" />
}