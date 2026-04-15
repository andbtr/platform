import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { AdminClientWrapper } from "@/components/admin/admin-client-wrapper"

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
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  
  if (userError || !userData.user) {
    redirect('/login')
  }

  const user = userData.user
  const meta = user.user_metadata ?? {}
  let isAuthorized = false

  if (meta.is_admin || meta.isAdmin || meta.role === 'admin') {
    isAuthorized = true
  } else {
    const { data: memberData } = await supabase
      .from('members')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle()
      
    if (memberData?.is_admin) {
      isAuthorized = true
    }
  }

  if (!isAuthorized) {
    redirect('/')
  }

  // Fetch initial payments
  const pageSize = 10
  const { data: paymentsData, count } = await supabase
    .from('payments')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(0, pageSize - 1)

  const payments = (paymentsData || []).map((p: any) => ({
    id: p.id,
    socioId: p.user_id || p.userId || p.socio_id,
    nombre: p.name || p.full_name || p.nombre || p.user_name || p.email,
    dni: p.dni || p.document || '',
    bloque: p.bloque || p.block || '',
    monto: p.amount_paid || p.amount || p.monto || 0,
    concepto: p.concept || p.concepto || p.description || 'Pago',
    fecha: p.created_at || p.fecha || p.inserted_at,
    voucherUrl: p.voucher_url || p.voucher || p.voucherUrl || '/images/voucher-sample.jpg',
    estado: p.status || p.estado || 'pendiente'
  }))

  return (
    <AdminClientWrapper 
      initialPayments={payments} 
      initialTotalCount={count} 
    />
  )
}
