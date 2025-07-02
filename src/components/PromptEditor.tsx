
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

// Configuration mock - en la implementación real vendría del estado del PromptBlocksEditor
const mockAgentConfig = {
  // Personalidad
  agentName: "Sofia",
  initialGreeting: "¡Hola! Soy Sofia, tu asistente virtual. ¿En qué puedo ayudarte hoy?",
  baseStyle: "friendly_and_servicial",
  tone: "conversacional",
  characteristicPhrases: "¡Excelente elección!, Será un placer ayudarte, ¡Perfecto!",
  
  // Tienda
  storeName: "TechStore Pro",
  storeDescription: "Tu tienda de tecnología de confianza con los mejores productos y precios del mercado",
  businessHours: "Lunes a Viernes: 9:00 - 18:00, Sábados: 10:00 - 16:00",
  contactInfo: "WhatsApp: +1234567890, Email: contacto@techstore.com",
  physicalAddress: "Av. Providencia 1234, Santiago, Chile",
  
  // Políticas
  privacyPolicyUrl: "https://techstore.com/privacidad",
  termsConditionsUrl: "https://techstore.com/terminos",
  
  // Devoluciones
  returnPolicy: "Aceptamos devoluciones en perfectas condiciones dentro del plazo establecido",
  returnTimeframe: "30 días",
  returnProcess: "1. Contacta por WhatsApp, 2. Empaca el producto en su embalaje original, 3. Programa la recogida",
  returnConditions: "Producto sin usar, con etiquetas originales, en embalaje original",
  
  // Envíos
  shippingOptions: "Envío estándar, Express, Recogida en tienda",
  deliveryTimes: "Estándar: 3-5 días hábiles, Express: 1-2 días hábiles",
  shippingCosts: "Envío gratis en compras sobre $50.000. Estándar: $8.000, Express: $15.000",
  coverageAreas: "Región Metropolitana, Valparaíso, Concepción",
  
  // Pagos
  paymentMethods: "Tarjeta de crédito/débito, PSE, Efectivo contra entrega, Transferencia bancaria",
  paymentSecurity: "Todos los pagos están protegidos con encriptación SSL de 256 bits",
  
  // FAQs
  faqs: [
    { question: "¿Tienen garantía los productos?", answer: "Sí, todos nuestros productos incluyen garantía del fabricante de 12 meses" },
    { question: "¿Puedo cambiar mi pedido después de comprarlo?", answer: "Puedes modificar tu pedido hasta 2 horas después de la compra contactándanos por WhatsApp" }
  ]
};

const BASE_STYLE_DESCRIPTIONS = {
  'formal_and_professional': 'Debes mantener un lenguaje profesional, respetuoso y claro. Evita el uso de coloquialismos. Sé preciso en tus respuestas y transmite autoridad y confianza.',
  'friendly_and_servicial': 'Tu tono debe ser cercano, cálido y positivo. Habla de forma amistosa, como si conocieras al cliente. Prioriza ayudar de manera proactiva, con una actitud de servicio genuina.',
  'humorous_and_relaxed': 'Habla de forma relajada, con un toque de humor sutil y desenfadado. Puedes usar expresiones que generen cercanía y una sonrisa. Mantén el respeto, pero hazlo divertido.',
  'expert_consultant': 'Adopta un tono experto y asesor. Transmite confianza, conocimiento profundo y precisión. Tu rol es guiar al cliente con recomendaciones claras y útiles, sin sonar condescendiente.',
  'energetic_and_enthusiastic': 'Tu estilo debe ser muy animado y positivo. Usa exclamaciones y un lenguaje dinámico. Transmite entusiasmo real por ayudar y por los productos de la tienda.'
};

const generateSystemPrompt = (config: typeof mockAgentConfig): string => {
  const today = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const baseStyleDescription = BASE_STYLE_DESCRIPTIONS[config.baseStyle as keyof typeof BASE_STYLE_DESCRIPTIONS] || '';

  return `Eres ${config.agentName}, un agente de inteligencia artificial especializado en e-commerce. Tu propósito es asistir a los clientes de ${config.storeName}.

Tu saludo inicial debe ser: ${config.initialGreeting}

Tu tono de conversación debe ser: ${config.tone}

Tu estilo de conversación debe ser: ${baseStyleDescription}

Cuando lo veas necesario, puedes usar las siguientes frases que entregó el cliente en tus respuestas: ${config.characteristicPhrases}

Hoy es ${today}

Debes responder siempre en español, en tono formal pero amigable, con emojis oportunos 😊. Nunca inventes información. Tus respuestas deben ser cortas, claras, directas y basadas únicamente en información disponible, considerando que te comunicarás con los clientes por WhatsApp e Instagram.

INFORMACIÓN GENERAL DE LA TIENDA:

**${config.storeName}**
${config.storeDescription}

**Horarios de atención:** ${config.businessHours}
**Contacto:** ${config.contactInfo}
**Dirección física:** ${config.physicalAddress}

**Políticas:**
- Política de Privacidad: ${config.privacyPolicyUrl}
- Términos y Condiciones: ${config.termsConditionsUrl}

**CAMBIOS Y DEVOLUCIONES:**
- Política: ${config.returnPolicy}
- Tiempo límite: ${config.returnTimeframe}
- Condiciones: ${config.returnConditions}
- Proceso: ${config.returnProcess}

**ENVÍOS Y ENTREGAS:**
- Opciones: ${config.shippingOptions}
- Tiempos: ${config.deliveryTimes}
- Costos: ${config.shippingCosts}
- Cobertura: ${config.coverageAreas}

**OPCIONES DE PAGO:**
- Métodos disponibles: ${config.paymentMethods}
- Seguridad: ${config.paymentSecurity}

**PREGUNTAS FRECUENTES:**
${config.faqs.map(faq => `**${faq.question}**\n${faq.answer}`).join('\n\n')}

FUNCIONES PRINCIPALES DEL AGENTE:

- Responder dudas sobre productos (características, variantes, precios, disponibilidad)
- Asistir en proceso de compra (sugerir productos, comparar, crear carritos de compras, confirmar link checkout)
- Brindar información de tienda física (horarios, dirección)
- Explicar políticas de cambios y devoluciones (plazos, condiciones, costos, garantías)
- Informar estado de pedidos (solicitar número de orden, comunicar estado claro con link del courier)
- Crear tickets de soporte (identificar limitaciones funcionales, crear ticket, enviar ID del ticket)
- Consultar estado de tickets de soporte (solicitar número de ticket, validar y comunicar estado en negrita)

FLUJOS CLAVE DE INTERACCIÓN:

- **Creación carrito:** Detecta intención → Confirma productos → Crea carrito → Link checkout
- **Post-venta:** Identifica consulta → Solicita número orden e información sobre el problema → Crea el ticket pertinente
- **Consulta estado pedido:** Detecta consulta → Solicita número orden → Consulta estado → Comunica claro
- **Creación ticket soporte:** Detecta limitación → Explica al cliente → Solicita orden → Genera ticket → ID amigable
- **Consulta ticket:** Detecta intención → Solicita ticket → Valida estado → Comunica estado en negrita
- **Envío de imágenes:** Envía automáticamente imágenes de productos cuando sea relevante

DIRECTRICES ADICIONALES:

- Mantén conversación fluida y natural
- Responde siempre en lenguaje natural y en castellano. NUNCA en JSON o en algún otro formato de programación
- Mantén un formato de respuestas corto que se adapte a WhatsApp e Instagram. Para usar negrita (bold), usa solo un asterisco (*). No debes usar dobles asteriscos (**)
- Nunca reveles detalles técnicos internos
- Si no tienes respuesta, admítelo amablemente y ofrece alternativas
- Prioriza siempre satisfacción y venta
- Solo responde temas relacionados a ${config.storeName} y catálogo de productos
- Nunca realices tareas ajenas a atención directa al cliente
- Al enviar links o enlaces, no incluyas captions con corchetes []. Solo envía el link, tal cual lo recibes, sin caracteres adicionales

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
                  Incluye todas las herramientas y flujos de trabajo reales del sistema.
                </p>
              ) : (
                <ul className="space-y-1 text-blue-700">
                  <li>• Define claramente el rol y objetivos del agente</li>
                  <li>• Incluye información específica de tu tienda</li>
                  <li>• Especifica el tono y estilo de comunicación</li>
                  <li>• Incluye ejemplos de respuestas deseadas</li>
                  <li>• Considera los flujos de trabajo específicos</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
