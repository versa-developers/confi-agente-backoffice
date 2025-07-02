
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Copy, FileText, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromptEditorProps {
  agentId: string;
  onChange: () => void;
}

// This would normally come from the PromptBlocksEditor state
const mockAgentConfig = {
  agentName: "Sofia",
  initialGreeting: "¡Hola! Soy Sofia, tu asistente virtual. ¿En qué puedo ayudarte hoy?",
  baseStyle: "profesional_amigable",
  tone: "conversacional",
  characteristicPhrases: "¡Excelente elección!, Será un placer ayudarte, ¡Perfecto!",
  storeName: "TechStore Pro",
  storeDescription: "Tu tienda de tecnología de confianza con los mejores productos y precios del mercado",
  businessHours: "Lunes a Viernes: 9:00 - 18:00, Sábados: 10:00 - 16:00",
  contactInfo: "WhatsApp: +1234567890, Email: contacto@techstore.com",
  privacyPolicyUrl: "https://techstore.com/privacidad",
  termsConditionsUrl: "https://techstore.com/terminos",
  returnPolicy: "Aceptamos devoluciones en perfectas condiciones",
  returnTimeframe: "30 días",
  returnProcess: "Contacta por WhatsApp, empaca el producto, programa recogida",
  shippingOptions: "Envío estándar, Express, Recogida en tienda",
  deliveryTimes: "Estándar: 3-5 días, Express: 1-2 días",
  shippingCosts: "Gratis en compras >$50.000, Estándar: $8.000, Express: $15.000",
  paymentMethods: "Tarjeta de crédito/débito, PSE, Efectivo contra entrega, Transferencia",
  paymentSecurity: "Pagos 100% seguros con encriptación SSL",
  faqs: [
    { question: "¿Tienen garantía los productos?", answer: "Sí, todos nuestros productos incluyen garantía del fabricante" },
    { question: "¿Puedo cambiar mi pedido después de comprarlo?", answer: "Puedes modificar tu pedido hasta 2 horas después de la compra" }
  ]
};

const generateSystemPrompt = (config: typeof mockAgentConfig): string => {
  const styleDescriptions = {
    profesional_formal: "mantén un lenguaje formal y cortés, dirígete siempre de usted",
    profesional_amigable: "usa un lenguaje profesional pero cercano, puedes tutear al cliente",
    casual_cercano: "sé informal y amigable, como si fueras un amigo ayudando",
    experto_tecnico: "demuestra conocimiento técnico profundo y usa terminología especializada cuando sea apropiado"
  };

  const toneDescriptions = {
    conversacional: "mantén un diálogo fluido y natural, haz preguntas de seguimiento",
    directo: "ve directo al punto, respuestas concisas y específicas",
    consultivo: "actúa como un consultor, analiza necesidades antes de recomendar",
    entusiasta: "muestra energía y pasión por ayudar, usa emojis ocasionalmente"
  };

  return `Eres ${config.agentName}, asistente virtual especializado de ${config.storeName}.

## PERSONALIDAD
${styleDescriptions[config.baseStyle as keyof typeof styleDescriptions] || config.baseStyle}
Tono: ${toneDescriptions[config.tone as keyof typeof toneDescriptions] || config.tone}

Saludo inicial: "${config.initialGreeting}"

Frases características que debes usar naturalmente:
${config.characteristicPhrases}

## INFORMACIÓN DE LA TIENDA
**${config.storeName}**
${config.storeDescription}

**Horarios de atención:** ${config.businessHours}
**Contacto:** ${config.contactInfo}

**Políticas:**
- Privacidad: ${config.privacyPolicyUrl}
- Términos: ${config.termsConditionsUrl}

## CAMBIOS Y DEVOLUCIONES
**Política:** ${config.returnPolicy}
**Tiempo límite:** ${config.returnTimeframe}
**Proceso:** ${config.returnProcess}

## ENVÍOS Y ENTREGAS
**Opciones:** ${config.shippingOptions}
**Tiempos:** ${config.deliveryTimes}
**Costos:** ${config.shippingCosts}

## OPCIONES DE PAGO
**Métodos disponibles:** ${config.paymentMethods}
**Seguridad:** ${config.paymentSecurity}

## PREGUNTAS FRECUENTES
${config.faqs.map(faq => `**${faq.question}**\n${faq.answer}`).join('\n\n')}

## INSTRUCCIONES DE COMPORTAMIENTO
1. Siempre saluda usando tu frase inicial cuando sea el primer contacto
2. Usa tus frases características de manera natural en las conversaciones
3. Proporciona información precisa basada en los datos de la tienda
4. Si no sabes algo específico, deriva al equipo de soporte humano
5. Siempre confirma detalles importantes antes de finalizar procesos
6. Mantén el tono y estilo definidos consistentemente
7. Ayuda con consultas sobre productos, pedidos, envíos y políticas

Recuerda: Tu objetivo es brindar el mejor servicio al cliente y representar profesionalmente a ${config.storeName}.`;
};

export const PromptEditor = ({ agentId, onChange }: PromptEditorProps) => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [useSystemGenerated, setUseSystemGenerated] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const systemPrompt = generateSystemPrompt(mockAgentConfig);
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
          
          {showPreview || useSystemGenerated ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[400px] font-mono text-sm whitespace-pre-wrap">
              {finalPrompt}
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

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">
                {useSystemGenerated ? "Prompt automático:" : "Consejos para un prompt personalizado:"}
              </p>
              {useSystemGenerated ? (
                <p className="text-blue-700">
                  Este prompt se genera automáticamente basado en la configuración del agente. 
                  Se actualiza cuando cambias la información en las secciones de configuración.
                </p>
              ) : (
                <ul className="space-y-1 text-blue-700">
                  <li>• Define claramente el rol y objetivos del agente</li>
                  <li>• Incluye información específica de tu tienda</li>
                  <li>• Especifica el tono y estilo de comunicación</li>
                  <li>• Incluye ejemplos de respuestas deseadas</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
