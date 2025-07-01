
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Bot, Settings, Plus } from "lucide-react";
import { AgentEditor } from "@/components/AgentEditor";

interface Seller {
  id: string;
  name: string;
  status: "active" | "inactive";
  agentsCount: number;
  lastModified: string;
}

const mockSellers: Seller[] = [
  {
    id: "1",
    name: "TechStore Pro",
    status: "active",
    agentsCount: 3,
    lastModified: "2024-07-01"
  },
  {
    id: "2", 
    name: "Fashion Boutique",
    status: "active",
    agentsCount: 2,
    lastModified: "2024-06-28"
  },
  {
    id: "3",
    name: "HomeDecor Plus",
    status: "inactive",
    agentsCount: 1,
    lastModified: "2024-06-25"
  }
];

const Index = () => {
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSellers = mockSellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedSeller) {
    return <AgentEditor seller={selectedSeller} onBack={() => setSelectedSeller(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configuración de Agentes</h1>
              <p className="text-gray-600">Gestiona y configura agentes personalizados por seller</p>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{filteredSellers.length} sellers</span>
          </div>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSellers.map((seller) => (
            <Card 
              key={seller.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90"
              onClick={() => setSelectedSeller(seller)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {seller.name}
                  </CardTitle>
                  <Badge 
                    variant={seller.status === "active" ? "default" : "secondary"}
                    className={seller.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                  >
                    {seller.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <CardDescription className="text-gray-600">
                  Última modificación: {new Date(seller.lastModified).toLocaleDateString('es-ES')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">
                      {seller.agentsCount} agente{seller.agentsCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <Button size="sm" variant="ghost" className="hover:bg-blue-50">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSellers.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron sellers</h3>
            <p className="text-gray-600">Prueba con otros términos de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
