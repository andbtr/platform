import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { AdminClientWrapper } from "@/components/admin/admin-client-wrapper"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function AdminPage() {
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

  // Verify admin status
  const { data: userData, error: userError } = await supabase.auth.getUser()
  
  if (userError || !userData.user) {
    console.error("Auth error:", userError)
    redirect('/login')
  }

  const user = userData.user
  const meta = user.user_metadata ?? {}
  let isAuthorized = false

  // Log para depuración
  console.log("Checking admin for user:", user.id)

  if (meta.is_admin || meta.isAdmin || meta.role === 'admin') {
    isAuthorized = true
  } else {
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()
    
    if (roleError) console.error("Role check error:", roleError)
    if (roleData) {
      isAuthorized = true
    }
  }

  console.log("Is authorized:", isAuthorized)

  if (!isAuthorized) {
    redirect('/')
  }

  // Fetch initial payments - only pending ones
  const pageSize = 10
  const { data: paymentsData, count: totalPendingCount } = await supabase
    .from('payments')
    .select('*', { count: 'exact' })
    .eq('status', 'PENDING')
    .order('created_at', { ascending: false })
    .range(0, pageSize - 1)

  // Get total count of all payments for pagination calculations
  const { count: totalAllCount } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true })

  // Fetch initial socios
  const { data: sociosData } = await supabase
    .from('members')
    .select('*, blocks(name)')
    .order('created_at', { ascending: false })

  const payments = (paymentsData || []).map((p: any) => {
    // Intentar diferentes campos de relación
    const possibleUserIds = [p.user_id, p.userId, p.member_id, p.memberId, p.socio_id, p.socioId]
    const userId = possibleUserIds.find(id => id !== undefined && id !== null)
    
    // Buscar el miembro con comparación robusta de IDs usando la data cruda
    const member = (sociosData || []).find((s: any) => 
      (s.id && userId && String(s.id).toLowerCase() === String(userId).toLowerCase())
    )
    
    // Pasamos proof_url directamente, la URL firmada se genera en el componente
    const paymentProofUrl = null

    return {
      id: p.id,
      socioId: userId,
      nombre: member?.full_name || `${member?.first_name || ""} ${member?.last_name || ""}`.trim() || p.name || 'Usuario',
      dni: member?.dni || '',
      bloque: member?.blocks?.name || member?.block_id || '',
      monto: p.amount_paid || 0,
      concepto: p.concept || p.description || 'Pago',
      method: p.method || '',
      fecha: p.created_at,
      bankAccountName: p.bank_account_name || '',
      paymentProofUrl: paymentProofUrl,
      proofUrl: p.proof_url,
      hasPaymentProof: Boolean(paymentProofUrl || p.proof_url),
      estado: p.status || 'PENDING'
    }
  })

  const socios = (sociosData || []).map((s: any) => ({
    id: s.id,
    nombre: s.full_name || `${s.first_name || ""} ${s.last_name || ""}`.trim() || s.email,
    dni: s.dni || '',
    bloque: s.blocks?.name || s.block_id || '',
    estado: s.status === 'active' || s.status === 'al_dia' ? 'al_dia' : 'atrasado',
    montoPagado: s.monto_pagado || s.amount_paid || s.total_paid || 0,
    email: s.email,
    telefono: s.phone_number || s.phone || '',
    created_at: s.created_at
  }))

  return (
    <>
      <div className="relative z-20">
        <AdminHeader />
      </div>

      <div className="pt-16 md:pt-20">
        <AdminClientWrapper 
          initialPayments={payments} 
          initialTotalCount={totalPendingCount}
          initialSocios={socios}
        />
      </div>
    </>
  )
}
