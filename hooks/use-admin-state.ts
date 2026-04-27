import { useState } from "react"
import { useAuth } from '@/components/providers/auth-provider'
import { useSupabaseConfig } from "@/components/providers/supabase-provider"
import { createClient } from "@supabase/supabase-js"

type UseAdminStateProps = {
  initialPayments: any[]
  initialTotalCount: number | null
  initialSocios: any[]
}

export function useAdminState({ initialPayments, initialTotalCount, initialSocios }: UseAdminStateProps) {
  const { accessToken } = useAuth()
  const { supabaseUrl, supabaseAnonKey } = useSupabaseConfig()
  
  console.log('useAdminState inicializado con:', { 
    initialPaymentsCount: initialPayments.length, 
    initialSociosCount: initialSocios.length 
  })
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBloque, setSelectedBloque] = useState<string>("todos")
  const [selectedStatus, setSelectedStatus] = useState<string>('PENDING')
  const [selectedPago, setSelectedPago] = useState<any | null>(null)
  const [isPaymentProofModalOpen, setIsPaymentProofModalOpen] = useState(false)
  const [pagosPendientes, setPagosPendientes] = useState<any[]>(initialPayments)
  const [loadingPagos, setLoadingPagos] = useState(false)
  const [pagosError, setPagosError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalCount, setTotalCount] = useState<number | null>(initialTotalCount)
  const [socios, setSocios] = useState<any[]>(initialSocios)

  const reloadPagos = async (opts: { pageNum?: number; pSize?: number; q?: string; s?: string }) => {
    setLoadingPagos(true)
    setPagosError(null)
    try {
      const token = accessToken
      const headers: Record<string,string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`
      headers['apikey'] = supabaseAnonKey

      if (!supabaseUrl) throw new Error('Server misconfigured')
      
      const p = opts.pageNum ?? page
      const ps = opts.pSize ?? pageSize
      const start = (p - 1) * ps
      
      const restParams = new URLSearchParams()
      restParams.set('select', '*')
      restParams.set('order', 'created_at.desc')
      restParams.set('limit', String(ps))
      restParams.set('offset', String(start))
      
      const q = opts.q ?? searchTerm
      if (q) restParams.set('or', `description.ilike.*${q}*,email.ilike.*${q}*,name.ilike.*${q}*`)
      
      const status = opts.s ?? selectedStatus
      if (status && status !== 'todos') restParams.set('status', `eq.${status}`)
      console.log('Parámetros de consulta:', { status, q, p, ps, restParams: restParams.toString() })

      const restUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/payments?${restParams.toString()}`
      console.log('URL completa:', restUrl)
      const res = await fetch(restUrl, { headers })
      
      if (!res.ok) {
        const errBody = await res.json().catch(() => null)
        throw new Error(errBody?.error || errBody?.message || `HTTP ${res.status}`)
      }
      
      const countHeader = res.headers.get('content-range') || ''
      const countMatch = countHeader.match(/\/(\d+)/)
      let count = countMatch ? parseInt(countMatch[1], 10) : null
      
      const body = await res.json()
      const payments = Array.isArray(body) ? body : (Array.isArray(body.payments) ? body.payments : [])
      console.log('Pagos obtenidos de la API:', payments.length, payments.map(p => ({ id: p.id, user_id: p.user_id, status: p.status })))
      
      // Client for storage URLs
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      const mapped = payments.map((p: any) => {
        // Intentar diferentes campos de relación
        const possibleUserIds = [p.user_id, p.userId, p.member_id, p.memberId, p.socio_id, p.socioId]
        const userId = possibleUserIds.find(id => id !== undefined && id !== null)
        
        // Buscar el miembro con comparación robusta de IDs
        const member = socios.find((s: any) => 
          (s.id && userId && String(s.id).toLowerCase() === String(userId).toLowerCase()) ||
          (s.user_id && userId && String(s.user_id).toLowerCase() === String(userId).toLowerCase())
        )
        
        console.log('Mapeando pago:', { 
          pagoId: p.id, 
          userId: userId,
          memberFound: !!member, 
          memberData: member ? { id: member.id, nombre: member.nombre } : null
        })

        // Pasamos proof_url directamente, la URL firmada se genera en el componente
        const paymentProofUrl = null
        const proofUrl = p.proof_url

        const estado = p.status || p.estado || 'PENDING'

        return {
          id: p.id,
          socioId: userId,
          nombre: member?.nombre || member?.full_name || p.name || 'Usuario',
          dni: member?.dni || '',
          bloque: member?.bloque || member?.blocks?.name || '',
          monto: p.amount_paid || 0,
          concepto: p.concept || p.description || 'Pago',
          fecha: p.created_at,
          additionalCode: p.adittional_code || '',
          bankAccountName: p.bank_account_name || '',
          paymentProofUrl: paymentProofUrl,
          proofUrl: proofUrl,
          hasPaymentProof: Boolean(proofUrl),
          estado: estado
        }
      })

      console.log('Pagos mapeados:', mapped.length, 'pagos')
      console.log('Filtro aplicado:', status)

      setPagosPendientes(mapped)
      if (count === null) {
          // Fallback if content-range wasn't present
          count = Array.isArray(body) && body.length < ps && p === 1 ? body.length : initialTotalCount
      }
      setTotalCount(count)
    } catch (err: any) {
      console.error(err)
      setPagosError(err?.message ?? 'Error')
      setPagosPendientes([])
    } finally {
      setLoadingPagos(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setPage(1)
    reloadPagos({ pageNum: 1, q: value })
  }

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    setPage(1)
    reloadPagos({ pageNum: 1, s: value })
  }

  const goToPage = (pageNum: number) => {
    setPage(pageNum)
    reloadPagos({ pageNum })
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
    reloadPagos({ pageNum: 1, pSize: size })
  }

  const handleAprobarPago = async (pagoId: number) => {
    console.log('Aprobando pago:', pagoId)
    try {
      if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase no configurado')
      const token = accessToken
      console.log('Token disponible:', !!token)
      const headers: Record<string,string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`
      headers['apikey'] = supabaseAnonKey
      headers['Content-Type'] = 'application/json'
      headers['Prefer'] = 'return=representation'

      const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/payments?id=eq.${pagoId}`
      console.log('URL de la petición:', url)

      const res = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: 'APPROVED' })
      })

      console.log('Respuesta del servidor:', res.status, res.statusText)

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Error response:', errorText)
        throw new Error('Error al aprobar')
      }

      console.log('Pago aprobado exitosamente')
      setPagosPendientes(prev => prev.filter(p => p.id !== pagoId))
      setIsPaymentProofModalOpen(false)
      setSelectedPago(null)
    } catch (err) {
      console.error('Error en handleAprobarPago:', err)
      alert('No se pudo aprobar el pago')
    }
  }

  const handleRechazarPago = async (pagoId: number) => {
    console.log('Rechazando pago:', pagoId)
    try {
      if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase no configurado')
      const token = accessToken
      console.log('Token disponible:', !!token)
      const headers: Record<string,string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`
      headers['apikey'] = supabaseAnonKey
      headers['Content-Type'] = 'application/json'

      const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/payments?id=eq.${pagoId}`
      console.log('URL de la petición:', url)

      const res = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: 'REJECTED' })
      })

      console.log('Respuesta del servidor:', res.status, res.statusText)

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Error response:', errorText)
        throw new Error('Error al rechazar')
      }

      console.log('Pago rechazado exitosamente')
      setPagosPendientes(prev => prev.filter(p => p.id !== pagoId))
      setIsPaymentProofModalOpen(false)
      setSelectedPago(null)
    } catch (err) {
      console.error('Error en handleRechazarPago:', err)
      alert('No se pudo rechazar el pago')
    }
  }

  const openPaymentProofModal = (pago: any) => {
    setSelectedPago(pago)
    setIsPaymentProofModalOpen(true)
  }

  const totalSocios = socios.length
  const totalRecaudado = socios.reduce((acc, s) => acc + (s.montoPagado || 0), 0)
  const sociosAlDia = socios.filter((s) => s.estado === "al_dia").length
  const sociosAtrasados = socios.filter((s) => s.estado === "atrasado").length

  const filteredSocios = socios.filter(socio => {
    const matchesSearch = 
      socio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      socio.dni.includes(searchTerm)
    const matchesBloque = selectedBloque === "todos" || socio.bloque === selectedBloque
    return matchesSearch && matchesBloque
  })

  return {
    searchTerm,
    setSearchTerm,
    selectedBloque,
    setSelectedBloque,
    selectedStatus,
    selectedPago,
    isPaymentProofModalOpen,
    setIsPaymentProofModalOpen,
    pagosPendientes,
    loadingPagos,
    pagosError,
    page,
    pageSize,
    totalCount,
    socios,
    totalSocios,
    totalRecaudado,
    sociosAlDia,
    sociosAtrasados,
    filteredSocios,
    handleSearch,
    handleStatusChange,
    goToPage,
    handlePageSizeChange,
    handleAprobarPago,
    handleRechazarPago,
    openPaymentProofModal
  }
}