import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { DashboardClientWrapper } from "@/components/dashboard/dashboard-client-wrapper"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default async function DashboardPage() {
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

  // get user without caching
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  let resolvedMemberId = null
  let memberDetails = null

  const { data: memberRow } = await supabase
    .from("members")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  resolvedMemberId = memberRow?.id ?? null
  memberDetails = memberRow

  if (!resolvedMemberId && user.email) {
    const { data: memberByEmail } = await supabase
      .from("members")
      .select("*")
      .eq("email", user.email)
      .limit(1)
      .maybeSingle()
    
    resolvedMemberId = memberByEmail?.id ?? resolvedMemberId
    memberDetails = memberByEmail ?? memberDetails
  }

  const start = 0
  const pageSize = 50

  let initialPayments: any[] = []

  if (resolvedMemberId) {
    const { data: pagos } = await supabase
      .from("payments")
      .select("*")
      .eq("member_id", resolvedMemberId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(start, start + pageSize - 1)

    initialPayments = pagos ?? []
  }

  const initialSocio = {
    nombre: memberDetails ? `${memberDetails.first_name ?? ""} ${memberDetails.last_name ?? ""}`.trim() : "",
    dni: memberDetails?.dni ?? "",
    bloque: memberDetails?.block_id ?? "",
    montoTotal: memberDetails?.total_installments ?? 0,
    montoPagado: 0,
    cuotasTotales: memberDetails?.total_installments ?? 0,
    cuotasPagadas: 0,
    proximoVencimiento: new Date().toISOString(),
    historialPagos: [],
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0a1628] to-background" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 blur-3xl rounded-full" />
      </div>

      <div className="relative z-20">
        <DashboardHeader />
      </div>

      <div className="pt-16 md:pt-20">
        <DashboardClientWrapper
          initialSocio={initialSocio}
          initialPayments={initialPayments}
          user={user}
        />
      </div>
    </div>
  )
}
