
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Copy, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromptEditorProps {
  agentId: string;
  onChange: () => void;
}

const mockPrompt = `Eres un asistente de ventas especializado para {store_name}. Tu objetivo es ayudar a los clientes con información sobre productos y procesos de compra.

INFORMACIÓN DE LA TIENDA:
- Horarios de atención: {store_hours}
- Política de envíos: {shipping_policy}
- Días de entrega estimados: {delivery_days} días
- Descuentos activos: {discount_active}

INSTRUCCIONES:
1. Saluda cordialmente y pregunta en qué puedes ayudar
2. Proporciona información clara y precisa sobre productos
3. Si no sabes algo, deriva al equipo de soporte
4. Mantén un tono profesional pero amigable
5. Siempre confirma los detalles antes de procesar una orden

HERRAMIENTAS DISPONIBLES:
- Buscar productos en el catálogo
- Crear carritos de compra
- Consultar estado de órdenes
- Agendar citas con el equipo comercial

Recuerda seguir siempre las políticas de la empresa y priorizar la satisfacción del cliente.`;

export const PromptEditor = ({ agentId, onChange }: PromptEditorProps) => {
  const [prompt, setPrompt] = useState(mockPrompt);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const variables = [
    "store_name", "store_hours", "shipping_policy", 
    "delivery_days", "discount_active"
  ];

  const resolvedPrompt = prompt
    .replace(/{store_name}/g, "TechStore Pro")
    .replace(/{store_hours}/g, "Lunes a Viernes 9:00 - 18:00")
    .replace(/{shipping_policy}/g, "Envío gratis en compras mayores a $50.000")
    .replace(/{delivery_days}/g, "3")
    .replace(/{discount_active}/g, "Sí");

  const copyPrompt = () => {
    navigator.clipboard.writeTextwm(showPreview ? resolvedPrompt : prompt);
    toast({
      title: "Copiado",
      description: "El prompt se ha copiado al portapapeles.",
    });
  };

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    onChange();
  };

  const insertVariable = (variable: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newPrompt = prompt.substring(0, start) + `{${variable}}` + prompt.substring(end);
      setPrompt(newPrompt);
      onChange();
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length + 2, start + variable.length + 2);
      }, 0);
    }
  };

  return (
    <Card className="h-fit bg-white/70 backdrop-blur-sm border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Prompt del Agente
            </CardTitle>
            <CardDescription className="text-gray-600">
              Configuración del comportamiento y personalidad
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="hover:bg-blue-50"
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? "Editor" : "Vista previa"}
            </Button>
            <Button size="sm" variant="outline" onClick={copyPrompt}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Variables disponibles */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Variables disponibles:</label>
          <div className="flex flex-wrap gap-2">
            {variables.map((variable) => (
              <Badge
                key={variable}
                variant="outline"
                className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                onClick={() => insertVariable(variable)}
              >
                {`{${variable}}`}
              </Badge>
            ))}
          </div>
        </div>

        {/* Editor de prompt */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {showPreview ? "Vista previa del prompt" : "Contenido del prompt"}
            </label>
            <div className="text-xs text-gray-500">
              {prompt.length} caracteres
            </div>
          </div>
          
          {showPreview ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[400px] font-mono text-sm whitespace-pre-wrap">
              {resolvedPrompt}
            </div>
          ) : (
            <Textarea
              value={prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              placeholder="Escribe el prompt del agente aquí..."
              className="min-h-[400px] font-mono text-sm resize-none"
            />
          )}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">Consejos para un buen prompt:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Define claramente el rol y objetivos del agente</li>
                <li>• Usa variables entre llaves para contenido dinámico</li>
                <li>• Incluye ejemplos de respuestas deseadas</li>
                <li>• Especifica el tono y estilo de comunicación</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
