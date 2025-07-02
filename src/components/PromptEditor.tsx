
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Copy, FileText, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    { question: "¿Puedo cambiar mi pedido después de comprarlo?", answer: "Puedes modificar tu pedido hasta 2 horas después de la compra contactándonos por WhatsApp" }
  ]
};

const BASE_STYLE_DESCRIPTIONS = {
  'formal_and_professional': 'Debes mantener un lenguaje profesional, respetuoso y claro. Evita el uso de coloquialismos. Sé preciso en tus respuestas y transmite autoridad y confianza.',
  'friendly_and_servicial': 'Tu tono debe ser cercano, cálido y positivo. Habla de forma amistosa, como si conocieras al cliente. Prioriza ayudar de manera proactiva, con una actitud de servicio genuina.',
  'humorous_and_relaxed': 'Habla de forma relajada, con un toque de humor sutil y desenfadado. Puedes usar expresiones que generen cercanía y una sonrisa. Mantén el respeto, pero hazlo divertido.',
  'expert_consultant': 'Adopta un tono experto y asesor. Transmite confianza, conocimiento profundo y precisión. Tu rol es guiar al cliente con recomendaciones claras y útiles, sin sonar condescendiente.',
  'energetic_and_enthusiastic': 'Tu estilo debe ser muy animado y positivo. Usa exclamaciones y un lenguaje dinámico. Transmite entusiasmo real por ayudar y por los productos de la tienda.'
};

const generateSystemPrompt = (config: typeof mockAgentConfig, enabledTools: Tool[]): string => {
  const today = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const baseStyleDescription = BASE_STYLE_DESCRIPTIONS[config.baseStyle as keyof typeof BASE_STYLE_DESCRIPTIONS] || '';

  // Generar lista de herramientas habilitadas
  const toolsList = enabledTools.length > 0 
    ? enabledTools.map(tool => `- ${tool.name}`).join('\n')
    : '- No hay herramientas disponibles';
  
  return `Eres {agentName}, un agente de inteligencia artificial especializado en e-commerce. Tu propósito es asistir a los clientes de {storeName}.

Tu saludo inicial debe ser: {initialGreeting}

Tu tono de conversación debe ser: {tone}

Tu estilo de conversación debe ser: {baseStyleDescription}

Cuando lo veas necesario, puedes usar las siguientes frases que entregó el cliente en tus respuestas: {characteristicPhrases}

Hoy es ${today}

Debes responder siempre en español, en tono formal pero amigable, con emojis oportunos 😊. Nunca inventes información. Tus respuestas deben ser cortas, claras, directas y basadas únicamente en información disponible, considerando que te comunicarás con los clientes por WhatsApp e Instagram.

INFORMACIÓN GENERAL DE LA TIENDA:

**{storeName}**
{storeDescription}

**Horarios de atención:** {businessHours}
**Contacto:** {contactInfo}
**Dirección física:** {physicalAddress}

**Políticas:**
- Política de Privacidad: {privacyPolicyUrl}
- Términos y Condiciones: {termsConditionsUrl}

**CAMBIOS Y DEVOLUCIONES:**
- Política: {returnPolicy}
- Tiempo límite: {returnTimeframe}
- Condiciones: {returnConditions}
- Proceso: {returnProcess}

**ENVÍOS Y ENTREGAS:**
- Opciones: {shippingOptions}
- Tiempos: {deliveryTimes}
- Costos: {shippingCosts}
- Cobertura: {coverageAreas}

**OPCIONES DE PAGO:**
- Métodos disponibles: {paymentMethods}
- Seguridad: {paymentSecurity}

**PREGUNTAS FRECUENTES:**
{faqs}

**HERRAMIENTAS DISPONIBLES:**

${toolsList}

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
- Solo responde temas relacionados a {storeName} y catálogo de productos
- Nunca realices tareas ajenas a atención directa al cliente
- Al enviar links o enlaces, no incluyas captions con corchetes []. Solo envía el link, tal cual lo recibes, sin caracteres adicionales

Recuerda: Tu objetivo es brindar el mejor servicio al cliente y representar profesionalmente a {storeName}.`;
};

const renderPromptWithHighlighting = (prompt: string, config: typeof mockAgentConfig, enabledTools: Tool[]): JSX.Element => {
  // Crear lista de herramientas para reemplazo
  const toolsList = enabledTools.length > 0 
    ? enabledTools.map(tool => `- ${tool.name}`).join('\n')
    : '- No hay herramientas disponibles';

  // Reemplazar variables con valores reales y aplicar colores
  let highlightedPrompt = prompt
    .replace(/{agentName}/g, `<span class="variable">${config.agentName}</span>`)
    .replace(/{initialGreeting}/g, `<span class="variable">${config.initialGreeting}</span>`)
    .replace(/{tone}/g, `<span class="variable">${config.tone}</span>`)
    .replace(/{baseStyleDescription}/g, `<span class="variable">${BASE_STYLE_DESCRIPTIONS[config.baseStyle as keyof typeof BASE_STYLE_DESCRIPTIONS] || config.baseStyle}</span>`)
    .replace(/{characteristicPhrases}/g, `<span class="variable">${config.characteristicPhrases}</span>`)
    .replace(/{storeName}/g, `<span class="variable">${config.storeName}</span>`)
    .replace(/{storeDescription}/g, `<span class="variable">${config.storeDescription}</span>`)
    .replace(/{businessHours}/g, `<span class="variable">${config.businessHours}</span>`)
    .replace(/{contactInfo}/g, `<span class="variable">${config.contactInfo}</span>`)
    .replace(/{physicalAddress}/g, `<span class="variable">${config.physicalAddress}</span>`)
    .replace(/{privacyPolicyUrl}/g, `<span class="variable">${config.privacyPolicyUrl}</span>`)
    .replace(/{termsConditionsUrl}/g, `<span class="variable">${config.termsConditionsUrl}</span>`)
    .replace(/{returnPolicy}/g, `<span class="variable">${config.returnPolicy}</span>`)
    .replace(/{returnTimeframe}/g, `<span class="variable">${config.returnTimeframe}</span>`)
    .replace(/{returnConditions}/g, `<span class="variable">${config.returnConditions}</span>`)
    .replace(/{returnProcess}/g, `<span class="variable">${config.returnProcess}</span>`)
    .replace(/{shippingOptions}/g, `<span class="variable">${config.shippingOptions}</span>`)
    .replace(/{deliveryTimes}/g, `<span class="variable">${config.deliveryTimes}</span>`)
    .replace(/{shippingCosts}/g, `<span class="variable">${config.shippingCosts}</span>`)
    .replace(/{coverageAreas}/g, `<span class="variable">${config.coverageAreas}</span>`)
    .replace(/{paymentMethods}/g, `<span class="variable">${config.paymentMethods}</span>`)
    .replace(/{paymentSecurity}/g, `<span class="variable">${config.paymentSecurity}</span>`)
    .replace(/{faqs}/g, `<span class="variable">${config.faqs.map(faq => `**${faq.question}**\n${faq.answer}`).join('\n\n')}</span>`)
    .replace(/\$\{toolsList\}/g, `<span class="tools-list">${toolsList}</span>`);

  return (
    <div 
      className="whitespace-pre-wrap font-mono text-sm"
      dangerouslySetInnerHTML={{ 
        __html: highlightedPrompt
      }}
    />
  );
};

const renderPromptWithVariableHighlighting = (prompt: string, enabledTools: Tool[]): JSX.Element => {
  // Crear lista de herramientas para reemplazo con color azul
  const toolsList = enabledTools.length > 0 
    ? enabledTools.map(tool => `<span class="tool-item">- ${tool.name}</span>`).join('\n')
    : '<span class="tool-item">- No hay herramientas disponibles</span>';

  // Highlight variables in the raw prompt text (for editor view)
  let highlightedPrompt = prompt.replace(
    /\{[^}]+\}/g, 
    (match) => `<span class="variable-placeholder">${match}</span>`
  );

  // Replace tools list with highlighted version (blue color)
  highlightedPrompt = highlightedPrompt.replace(
    /\$\{toolsList\}/g, 
    `<span class="tools-section">${toolsList}</span>`
  );

  return (
    <div 
      className="whitespace-pre-wrap font-mono text-sm"
      dangerouslySetInnerHTML={{ 
        __html: highlightedPrompt
      }}
    />
  );
};

export const PromptEditor = ({ agentId, onChange, tools = [] }: PromptEditorProps) => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [useSystemGenerated, setUseSystemGenerated] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [localTools, setLocalTools] = useState<Tool[]>([]);
  const { toast } = useToast();

  // Simulación de herramientas activas por defecto para testing
  useEffect(() => {
    if (tools.length === 0) {
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
    } else {
      setLocalTools(tools);
      console.log('Using tools from parent:', tools);
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

          {/* Legend for variables */}
          {(showPreview && useSystemGenerated) || (!showPreview && useSystemGenerated) ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">Leyenda de colores:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 bg-green-100 border border-green-300 rounded"></span>
                      <span>Variables editables en Prompt Blocks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 bg-blue-100 border border-blue-300 rounded"></span>
                      <span>Herramientas activas ({enabledTools.length} de {localTools.length})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

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
                    Las variables en verde se editan en "Configuración del Agente" y las herramientas 
                    se activan/desactivan en "Herramientas".
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
    </>
  );
};
