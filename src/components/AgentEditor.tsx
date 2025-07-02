import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Bot, Save, RotateCcw, Plus } from "lucide-react";
import { PromptBlocksEditor } from "./PromptBlocksEditor";
import { PromptEditor } from "./PromptEditor";
import { ToolsManager } from "./ToolsManager";
import { useToast } from "@/hooks/use-toast";

interface Seller {
  id: string;
  name: string;
  status: "active" | "inactive";
  agentsCount: number;
  lastModified: string;
}

interface Agent {
  id: string;
  name: string;
  type: "pre-sale" | "post-sale" | "onboarding" | "support";
  status: "active" | "inactive";
}

interface Tool {
  id: string;
  name: string;
  description: string;
  type: "native" | "custom";
  enabled: boolean;
  category: "products" | "cart" | "orders" | "support" | "media" | "policies";
}

interface AgentEditorProps {
  seller: Seller;
  onBack: () => void;
}

const mockAgents: Agent[] = [
  { id: "1", name: "Pre-venta", type: "pre-sale", status: "active" },
  { id: "2", name: "Post-venta", type: "post-sale", status: "active" },
  { id: "3", name: "Onboarding", type: "onboarding", status: "inactive" }
];

export const AgentEditor = ({ seller, onBack }: AgentEditorProps) => {
  const [selectedAgent, setSelectedAgent] = useState(mockAgents[0].id);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [agentTools, setAgentTools] = useState<Tool[]>([]);
  const { toast } = useToast();

  const currentAgent = mockAgents.find(agent => agent.id === selectedAgent);

  const handleSave = () => {
    toast({
      title: "Cambios guardados",
      description: "La configuración del agente se ha guardado correctamente.",
    });
    setHasUnsavedChanges(false);
  };

  const handleReset = () => {
    toast({
      title: "Agente reseteado",
      description: "Se ha restaurado la configuración base del agente.",
    });
    setHasUnsavedChanges(false);
  };

  const handleToolsChange = (tools: Tool[]) => {
    setAgentTools(tools);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={onBack} className="hover:bg-white/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{seller.name}</h1>
                <p className="text-gray-600">Configuración de agentes</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Guardar cambios
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Resetear a base
            </Button>
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Cambios sin guardar
              </Badge>
            )}
          </div>
        </div>

        {/* Agent Tabs */}
        <Tabs value={selectedAgent} onValueChange={setSelectedAgent} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:inline-flex bg-white/70 backdrop-blur-sm">
            {mockAgents.map((agent) => (
              <TabsTrigger 
                key={agent.id} 
                value={agent.id}
                className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
              >
                <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                {agent.name}
              </TabsTrigger>
            ))}
            <Button size="sm" variant="ghost" className="ml-2 hover:bg-blue-50">
              <Plus className="h-4 w-4" />
            </Button>
          </TabsList>

          {mockAgents.map((agent) => (
            <TabsContent key={agent.id} value={agent.id} className="space-y-6">
              {/* Three Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Prompt Blocks */}
                <div className="lg:col-span-3">
                  <PromptBlocksEditor
                    agentId={agent.id}
                    onChange={() => setHasUnsavedChanges(true)}
                  />
                </div>

                {/* Center Column - Prompt Editor */}
                <div className="lg:col-span-6">
                  <PromptEditor
                    agentId={agent.id}
                    onChange={() => setHasUnsavedChanges(true)}
                    tools={agentTools}
                  />
                </div>

                {/* Right Column - Tools */}
                <div className="lg:col-span-3">
                  <ToolsManager
                    agentId={agent.id}
                    onChange={() => setHasUnsavedChanges(true)}
                    onToolsChange={handleToolsChange}
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
