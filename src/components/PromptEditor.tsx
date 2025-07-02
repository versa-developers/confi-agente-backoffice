
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Copy, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateSystemPrompt } from "./PromptEditor/promptUtils";
import { mockAgentConfig } from "./PromptEditor/constants";
import { renderPromptWithHighlighting, renderPromptWithVariableHighlighting } from "./PromptEditor/PromptRenderer";
import { PromptLegend } from "./PromptEditor/PromptLegend";

interface Tool {
  id: string;
  name: string;
  enabled: boolean;
}

interface PromptEditorProps {
  agentId: string;
  onChange: () => void;
  tools?: Tool[];
}

export const PromptEditor = ({ agentId, onChange, tools = [] }: PromptEditorProps) => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [useSystemGenerated, setUseSystemGenerated] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [localTools, setLocalTools] = useState<Tool[]>([]);
  const { toast } = useToast();

  // Update local tools when tools prop changes
  useEffect(() => {
    if (tools.length > 0) {
      setLocalTools(tools);
      console.log('Using tools from parent:', tools);
    } else {
      // Si no se reciben tools del padre, usar herramientas mock para demostración
      const mockEnabledTools: Tool[] = [
        { id: "1", name: "Descripción Completa de Productos", enabled: true },
        { id: "2", name: "Generar Carrito de Compras", enabled: true },
        { id: "3", name: "Agregar al Carrito Existente", enabled: true },
        { id: "4", name: "Estado de Envío", enabled: true },
        { id: "5", name: "Generar Ticket de Soporte", enabled: true },
        { id: "6", name: "Estado de Ticket", enabled: true },
        { id: "7", name: "Envío de Imágenes", enabled: true },
        { id: "8", name: "Políticas Generales", enabled: true },
        { id: "9", name: "Preguntas Frecuentes", enabled: true }
      ];
      setLocalTools(mockEnabledTools);
      console.log('Using mock tools because no tools received from parent:', mockEnabledTools);
    }
  }, [tools]);

  // Filtrar solo herramientas habilitadas
  const enabledTools = localTools.filter(tool => tool.enabled);
  
  // Debug: agregar console.log para verificar qué herramientas están llegando
  console.log('Tools received in PromptEditor:', tools);
  console.log('Local tools:', localTools);
  console.log('Enabled tools:', enabledTools);
  
  const systemPrompt = generateSystemPrompt(mockAgentConfig, enabledTools);
  const finalPrompt = useSystemGenerated ? systemPrompt : customPrompt;

  const copyPrompt = () => {
    navigator.clipboard.writeText(finalPrompt);
    toast({
      title: "Copiado",
      description: "El prompt se ha copiado al portapapeles.",
    });
  };

  const handleCustomPromptChange = (value: string) => {
    setCustomPrompt(value);
    onChange();
  };

  const generateNewPrompt = () => {
    setUseSystemGenerated(true);
    toast({
      title: "Prompt regenerado",
      description: "Se ha generado un nuevo prompt basado en la configuración actual.",
    });
    onChange();
  };

  return (
    <>
      <style>{`
        .variable {
          color: #16a34a;
          font-weight: 600;
        }
        .variable-placeholder {
          color: #16a34a;
          font-weight: 600;
        }
        .tools-list {
          color: #2563eb;
          font-weight: 500;
        }
        .tools-section {
          color: #2563eb;
          font-weight: 500;
        }
        .tool-item {
          color: #2563eb;
          font-weight: 500;
          display: block;
        }
        .tool-enabled {
          background-color: #dcfce7;
          color: #16a34a;
          padding: 2px 4px;
          border-radius: 4px;
          font-weight: 500;
        }
      `}</style>
      
      <Card className="h-fit bg-white/70 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Prompt del Sistema
              </CardTitle>
              <CardDescription className="text-gray-600">
                Prompt generado automáticamente o personalizado
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={generateNewPrompt}
                className="hover:bg-green-50"
              >
                <Sparkles className="h-4 w-4" />
                Regenerar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="hover:bg-blue-50"
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPreview ? "Editor" : "Preview"}
              </Button>
              <Button size="sm" variant="outline" onClick={copyPrompt}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Modo de prompt */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="system-generated"
                checked={useSystemGenerated}
                onChange={() => setUseSystemGenerated(true)}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="system-generated" className="text-sm font-medium">
                Prompt generado automáticamente
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="custom-prompt"
                checked={!useSystemGenerated}
                onChange={() => setUseSystemGenerated(false)}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="custom-prompt" className="text-sm font-medium">
                Prompt personalizado
              </label>
            </div>
          </div>

          {/* Editor de prompt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                {showPreview ? "Vista previa del prompt" : useSystemGenerated ? "Prompt del sistema" : "Prompt personalizado"}
              </label>
              <div className="flex items-center gap-2">
                <Badge variant={useSystemGenerated ? "default" : "secondary"}>
                  {useSystemGenerated ? "Auto-generado" : "Personalizado"}
                </Badge>
                <div className="text-xs text-gray-500">
                  {finalPrompt.length} caracteres
                </div>
              </div>
            </div>
            
            {showPreview && useSystemGenerated ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
                {renderPromptWithHighlighting(finalPrompt, mockAgentConfig, enabledTools)}
              </div>
            ) : showPreview ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[400px] max-h-[600px] overflow-y-auto font-mono text-sm whitespace-pre-wrap">
                {finalPrompt}
              </div>
            ) : useSystemGenerated ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
                {renderPromptWithVariableHighlighting(finalPrompt, enabledTools)}
              </div>
            ) : (
              <Textarea
                value={customPrompt}
                onChange={(e) => handleCustomPromptChange(e.target.value)}
                placeholder="Escribe tu prompt personalizado aquí..."
                className="min-h-[400px] font-mono text-sm resize-none"
              />
            )}
          </div>

          <PromptLegend 
            useSystemGenerated={useSystemGenerated}
            enabledToolsCount={enabledTools.length}
            totalToolsCount={localTools.length}
          />
        </CardContent>
      </Card>
    </>
  );
};
