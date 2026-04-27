import { Search, Filter, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface SociosTableProps {
  searchTerm: string
  selectedBloque: string
  filteredSocios: any[]
  handleSearch: (value: string) => void
  setSelectedBloque: (value: string) => void
}

export function SociosTable({
  searchTerm,
  selectedBloque,
  filteredSocios,
  handleSearch,
  setSelectedBloque
}: SociosTableProps) {
  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o DNI..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-card/50 border-primary/30"
          />
        </div>
        <Select value={selectedBloque} onValueChange={setSelectedBloque}>
          <SelectTrigger className="w-full md:w-48 bg-card/50 border-primary/30">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrar por bloque" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los bloques</SelectItem>
            <SelectItem value="Cholitas">Cholitas</SelectItem>
            <SelectItem value="Morenos">Morenos</SelectItem>
            <SelectItem value="Osos">Osos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Socios Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Socio</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">DNI</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Bloque</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Pagado</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {filteredSocios.map((socio) => (
                <tr key={socio.id} className="hover:bg-primary/5 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">{socio.nombre}</p>
                      <p className="text-xs text-muted-foreground md:hidden">DNI: {socio.dni}</p>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <p className="text-foreground">{socio.dni}</p>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <Badge variant="outline" className="border-primary/30">{socio.bloque}</Badge>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-bold text-foreground">S/ {socio.montoPagado}</p>
                      <p className="text-xs text-muted-foreground">{socio.cuotasPagadas}/10 cuotas</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge 
                      className={socio.estado === "al_dia" 
                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" 
                        : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      }
                    >
                      {socio.estado === "al_dia" ? "Al dia" : "Atrasado"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSocios.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No se encontraron socios.</p>
          </div>
        )}
      </div>
    </div>
  )
}
