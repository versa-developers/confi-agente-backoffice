
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Wrench, ExternalLink } from "lucide-react";
import { CustomToolModal } from "./CustomToolModal";
import { useToast } from "@/hooks/use-toast";

interface Tool {
  id: string;
  name: string;
  description: string;
  type: "native" | "custom";
  enabled: boolean;
  category: "commerce" | "support" | "analytics" | "integration";
}

interface ToolsManagerProps {
  agentId: string;
  onChange: () => void;
}

const mockTools: Tool[] = [
  {
    id: "1",
    name: "Crear Carrito",
    description: "Permite crear carritos de compra para los clientes",
    type: "native",
    enabled: true,
    category: "commerce"
  },
  {
    id: "2",
    name: "Consultar Orden",
    description: "Busca información sobre órdenes existentes",
    type: "native",
    enabled: true,
    category: "commerce"
  },
  {
    id: "3",
    name: "Agendar Cita",
    description: "Programa citas con el equipo comercial",
    type: "native",
    enabled: false,
    category: "support"
  },
  {
    id: "4",
    name: "Webhook Inventory",
    description: "Consulta inventario en sistema externo",
    type: "custom",
    enabled: true,
    category: "integration"
  }
];

const categoryColors = {
  commerce: "bg-green-100 text-green-800",
  support: "bg-blue-100 text-blue-800",
  analytics: "bg-purple-100 text-purple-800",
  integration: "bg-orange-100 text-orange-800"
};

const categoryLabels = {
  commerce: "Comercio",
  support: "Soporte",
  analytics: "Analytics",
  integration: "Integración"
};

export const ToolsManager = ({ agentId, onChange }: ToolsManagerProps) => {
  const [tools, setTools] = useState<Tool[]>(mockTools);
  const [showCustomToolModal, setShowCustomToolModal] = useState(false);
  const { toast } = useToast();

  const toggleTool = (toolId: string) => {
    setTools(tools.map(tool => 
      tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool
    ));
    onChange();
    
    const tool = tools.find(t => t.id === toolId);
    toast({
      title: tool?.enabled ? "Tool desactivada" : "Tool activada",
      description: `${tool?.name} ha sido ${tool?.enabled ? 'desactivada' : 'activada'}.`,
    });
  };

  const addCustomTool = (toolData: any) => {
    const newTool: Tool = {
      id: Date.now().toString(),
      name: toolData.name,
      description: toolData.description,
      type: "custom",
      enabled: true,
      category: "integration"
    };
    
    setTools([...tools, newTool]);
    setShowCustomToolModal(false);
    onChange();
    
    toast({
      title: "Tool personalizada creada",
      description: `${toolData.name} se ha agregado correctamente.`,
    });
  };

  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  return (
    <>
      <Card className="h-fit bg-white/70 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Herramientas
              </CardTitle>
              <CardDescription className="text-gray-600">
                Tools disponibles para el agente
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => setShowCustomToolModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(groupedTools).map(([category, categoryTools]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className={categoryColors[category as keyof typeof categoryColors]}>
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </Badge>
                <span className="text-xs text-gray-500">
                  {categoryTools.filter(t => t.enabled).length}/{categoryTools.length} activas
                </span>
              </div>
              
              <div className="space-y-3">
                {categoryTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {tool.name}
                        </h4>
                        {tool.type === "custom" && (
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-3">
                      {tool.type === "custom" && (
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Settings className="h-3 w-3" />
                        </Button>
                      )}
                      <Switch
                        checked={tool.enabled}
                        onCheckedChange={() => toggleTool(tool.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {tools.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Wrench className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No hay herramientas configuradas</p>
              <p className="text-xs text-gray-400">Agrega tools para expandir las capacidades</p>
            </div>
          )}

          {/* Stats */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Tools activas:</span>
              <span className="font-medium text-gray-900">
                {tools.filter(t => t.enabled).length} de {tools.length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <CustomToolModal
        isOpen={showCustomToolModal}
        onClose={() => setShowCustomToolModal(false)}
        onSave={addCustomTool}
      />
    </>
  );
};
