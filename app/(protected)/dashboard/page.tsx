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

  // Check if user is admin - if so, redirect to admin panel
  const meta = user.user_metadata ?? {}
  let isAdmin = false

  console.log("Dashboard - Checking admin for user:", user.id)

  if (meta.is_admin || meta.isAdmin || meta.role === 'admin') {
    isAdmin = true
  } else {
    // Intentar consulta directa a la tabla roles
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()
      
    if (roleError) {
      console.error("Dashboard - Role check error:", roleError)
    }
    
    if (roleData) {
      console.log("Dashboard - Admin role found in DB")
      isAdmin = true
    }
  }

  if (isAdmin) {
    console.log("Dashboard - Redirecting to /admin")
    redirect('/admin')
  }

  const { data: memberRow } = await supabase
    .from("members")
    .select("*, blocks(*)")
    .eq("id", user.id)
    .single()

  let memberDetails = memberRow

  // USAR EL ID DE AUTH DIRECTAMENTE PARA PAGOS
  // Para asegurar que coincida con la política RLS (user_id = auth.uid())
  const authUserId = user.id

  // Calcular el monto mensual basado en el precio del bloque y cuotas iniciales
  const precioBloque = memberDetails?.blocks?.total_price || memberDetails?.blocks?.price || 0
  const cuotasRegistro = memberDetails?.total_installments || 1
  const montoMensualCalculado = precioBloque > 0 ? (precioBloque / cuotasRegistro) : 90

  const start = 0
  const pageSize = 50

  let initialPayments: any[] = []

  if (authUserId) {
    const { data: pagos, error: pagosError } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", authUserId)
      .order("created_at", { ascending: false })
      .range(start, start + pageSize - 1)

    if (pagosError) {
      console.error("Error fetching initial payments:", pagosError)
    }
    
    initialPayments = pagos ?? []
  }

  const initialSocio = {
    nombre: memberDetails ? `${memberDetails.first_name ?? ""} ${memberDetails.last_name ?? ""}`.trim() : "",
    dni: memberDetails?.dni ?? "",
    bloque: memberDetails?.blocks?.name ?? memberDetails?.blocks?.block_name ?? memberDetails?.block_id ?? "",
    montoMensual: montoMensualCalculado, 
    montoTotal: precioBloque || (cuotasRegistro * montoMensualCalculado),
    montoPagado: initialPayments.filter(p => {
      const s = (p.status || '').toLowerCase();
      return s === 'approved' || s === 'aprobado';
    }).reduce((acc, p) => acc + (p.amount_paid || 0), 0),
    cuotasTotales: cuotasRegistro,
    cuotasPagadas: Math.floor(initialPayments.filter(p => {
      const s = (p.status || '').toLowerCase();
      return s === 'approved' || s === 'aprobado';
    }).reduce((acc, p) => acc + (p.amount_paid || 0), 0) / montoMensualCalculado),
    proximoVencimiento: new Date().toISOString(),
    registrationDate: memberDetails?.created_at || new Date().toISOString(),
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
