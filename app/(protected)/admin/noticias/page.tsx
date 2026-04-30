import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminNewsClient } from "@/components/admin/admin-news-client"

export default async function AdminNewsPage() {
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get('sb-access-token')
  const token = tokenCookie?.value

  if (!token) {
    redirect('/login')
  }

  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_ANON_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    auth: {
      persistSession: false
    }
  })

  const { data: userData, error: userError } = await supabase.auth.getUser()
  
  if (userError || !userData.user) {
    redirect('/login')
  }

  const user = userData.user
  const meta = user.user_metadata ?? {}
  let isAuthorized = false

  if (meta.is_admin || meta.isAdmin || meta.role === 'admin') {
    isAuthorized = true
  } else {
    const { data: roleData } = await supabase
      .from('roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()
    
    if (roleData) {
      isAuthorized = true
    }
  }

  if (!isAuthorized) {
    redirect('/')
  }

  const { data: newsData } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false })

  const news = (newsData || []).map((n: any) => ({
    id: n.id,
    title: n.title,
    content: n.content,
    image_url: n.image_url,
    link: n.link,
    priority: n.priority,
    type: n.type,
    active: n.active,
    created_at: n.created_at
  }))

  return (
    <>
      <div className="relative z-20">
        <AdminHeader activeSection="noticias" />
      </div>

      <div className="pt-16 md:pt-20">
        <AdminNewsClient initialNews={news} />
      </div>
    </>
  )
}