"use client"

import { useProfileState } from "@/hooks/use-profile-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, CreditCard, Phone, LogOut, Save, ArrowLeft, Layout } from "lucide-react"
import Link from "next/link"

export function ProfileClient({ user, initialMember }: { user: any; initialMember: any }) {
  const { formData, isSubmitting, blocks, blocksLoading, handleChange, handleSelectChange, handleSubmit, handleLogout } = useProfileState({ user, initialMember })

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al Panel
      </Link>

      <Card className="glass-card border-primary/20 bg-card/50 backdrop-blur-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-2xl bg-background border-4 border-primary/20 flex items-center justify-center shadow-2xl">
              <User className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>

        <CardHeader className="pt-16 pb-6">
          <CardTitle className="text-3xl font-serif font-bold">Mi Perfil</CardTitle>
          <CardDescription>Gestiona tu información personal en la plataforma</CardDescription>
        </CardHeader>

        <CardContent>
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombres</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="first_name" 
                    name="first_name" 
                    value={formData.first_name} 
                    onChange={handleChange} 
                    className="pl-10 bg-background/50 border-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Apellidos</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="last_name" 
                    name="last_name" 
                    value={formData.last_name} 
                    onChange={handleChange} 
                    className="pl-10 bg-background/50 border-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  disabled 
                  className="pl-10 bg-background/30 border-primary/10 text-muted-foreground cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-muted-foreground italic">El correo no se puede cambiar por seguridad.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dni">DNI / Documento</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="dni" 
                    name="dni" 
                    value={formData.dni} 
                    onChange={handleChange} 
                    className="pl-10 bg-background/50 border-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="pl-10 bg-background/50 border-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="block_id">Bloque Asignado</Label>
              <div className="relative">
                <Layout className="absolute left-3 top-3 w-4 h-4 text-muted-foreground z-10" />
                <Select value={formData.block_id} onValueChange={handleSelectChange} disabled={blocksLoading}>
                  <SelectTrigger className="pl-10 bg-background/50 border-primary/20 focus:border-primary transition-all">
                    <SelectValue placeholder={blocksLoading ? "Cargando bloques..." : "Selecciona un bloque"} />
                  </SelectTrigger>
                  <SelectContent>
                    {blocks.map((block: any) => (
                      <SelectItem key={block.id} value={block.id}>
                        {block.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-[10px] text-muted-foreground italic">Cambiar el bloque actualizará tu monto y cuotas sugeridas.</p>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-4 border-t border-primary/10 pt-6">
          <Button 
            form="profile-form" 
            type="submit" 
            className="w-full sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Guardando..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleLogout}
            className="w-full sm:w-auto border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
