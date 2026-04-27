import { useState, useEffect } from "react"
import { createSupabaseClient } from "@/lib/supabase"
import { useSupabaseConfig } from "@/components/providers/supabase-provider"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function useProfileState({ user, initialMember }: { user: any; initialMember: any }) {
  const router = useRouter()
  const { supabaseUrl, supabaseAnonKey } = useSupabaseConfig()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [member, setMember] = useState(initialMember)
  const [blocks, setBlocks] = useState<any[]>([])
  const [blocksLoading, setBlocksLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    first_name: initialMember?.first_name || "",
    last_name: initialMember?.last_name || "",
    dni: initialMember?.dni || "",
    phone: initialMember?.phone_number || initialMember?.phone || "",
    email: initialMember?.email || user?.email || "",
    block_id: initialMember?.block_id || "",
  })

  // Cargar lista de bloques disponibles
  useEffect(() => {
    async function fetchBlocks() {
      if (!supabaseUrl || !supabaseAnonKey) return
      try {
        const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
        const { data, error } = await supabase
          .from("blocks")
          .select("id, name")
          .order("name", { ascending: true })
        
        if (error) throw error
        setBlocks(data || [])
      } catch (err) {
        console.error("Error fetching blocks:", err)
      } finally {
        setBlocksLoading(false)
      }
    }
    fetchBlocks()
  }, [supabaseUrl, supabaseAnonKey])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, block_id: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !supabaseUrl || !supabaseAnonKey) return

    setIsSubmitting(true)
    try {
      const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
      
      const updateData: any = {}
      
      if (formData.first_name.trim() !== "") updateData.first_name = formData.first_name
      if (formData.last_name.trim() !== "") updateData.last_name = formData.last_name
      if (formData.dni && formData.dni.toString().trim() !== "") updateData.dni = formData.dni
      if (formData.phone && formData.phone.toString().trim() !== "") updateData.phone_number = formData.phone

      // Solo enviar block_id si tiene un valor válido (UUID)
      if (formData.block_id && formData.block_id !== "") {
        updateData.block_id = formData.block_id
      }

      console.log("Datos a actualizar:", updateData)

      const { error } = await supabase
        .from("members")
        .update(updateData)
        .eq("id", user.id)

      if (error) throw error
      
      toast.success("¡Perfil actualizado! Redirigiendo...")
      
      // Pequeña pausa para que el usuario vea el mensaje antes de redirigir
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1500)
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error("Error al actualizar: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    if (!supabaseUrl || !supabaseAnonKey) return
    const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return {
    formData,
    isSubmitting,
    blocks,
    blocksLoading,
    handleChange,
    handleSelectChange,
    handleSubmit,
    handleLogout,
    member
  }
}
