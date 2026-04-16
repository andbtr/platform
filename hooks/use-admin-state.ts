import { useState } from "react"
import { useAuth } from '@/components/providers/auth-provider'
import { useSupabaseConfig } from "@/components/providers/supabase-provider"

type UseAdminStateProps = {
  initialPayments: any[]
  initialTotalCount: number | null
}

export function useAdminState({ initialPayments, initialTotalCount }: UseAdminStateProps) {
  const { accessToken } = useAuth()
  const { supabaseUrl, supabaseAnonKey } = useSupabaseConfig()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBloque, setSelectedBloque] = useState<string>("todos")
  const [selectedStatus, setSelectedStatus] = useState<string>('todos')
  const [selectedPago, setSelectedPago] = useState<any | null>(null)
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false)
  const [pagosPendientes, setPagosPendientes] = useState<any[]>(initialPayments)
  const [loadingPagos, setLoadingPagos] = useState(false)
  const [pagosError, setPagosError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalCount, setTotalCount] = useState<number | null>(initialTotalCount)

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

      const restUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/payments?${restParams.toString()}`
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
      
      const mapped = payments.map((p: any) => ({
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

  const handleAprobarPago = (pagoId: number) => {
    setPagosPendientes(prev => prev.filter(p => p.id !== pagoId))
    setIsVoucherModalOpen(false)
    setSelectedPago(null)
  }

  const handleRechazarPago = (pagoId: number) => {
    setPagosPendientes(prev => prev.filter(p => p.id !== pagoId))
    setIsVoucherModalOpen(false)
    setSelectedPago(null)
  }

  const openVoucherModal = (pago: any) => {
    setSelectedPago(pago)
    setIsVoucherModalOpen(true)
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
    isVoucherModalOpen,
    setIsVoucherModalOpen,
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
    openVoucherModal
  }
}