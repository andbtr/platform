import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { ProfileClient } from "@/components/dashboard/profile-client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("sb-access-token")?.value

  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_ANON_KEY!

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken || ""}`,
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: memberRow } = await supabase
    .from("members")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background - Replicando el estilo del dashboard */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0a1628] to-background" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 blur-3xl rounded-full" />
      </div>

      <div className="relative z-20">
        <DashboardHeader />
      </div>

      <div className="pt-16 md:pt-20">
        <ProfileClient user={user} initialMember={memberRow} />
      </div>
    </div>
  )
}
