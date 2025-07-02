import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Plus, Trash2, User, Store, Shield, RefreshCw, Truck, CreditCard, HelpCircle, Maximize } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface PromptConfiguration {
  // Personalidad del agente
  agentName: string;
  initialGreeting: string;
  baseStyle: string;
  tone: string;
  characteristicPhrases: string;
  
  // Sobre la tienda
  storeName: string;
  storeDescription: string;
  businessHours: string;
  contactInfo: string;
  
  // Políticas generales
  privacyPolicyUrl: string;
  termsConditionsUrl: string;
  
  // Cambios y devoluciones
  returnPolicy: string;
  returnTimeframe: string;
  returnProcess: string;
  
  // Envíos y entregas
  shippingOptions: string;
  deliveryTimes: string;
  shippingCosts: string;
  
  // Opciones de pago
  paymentMethods: string;
  paymentSecurity: string;
  
  // Preguntas frecuentes
  faqs: FAQ[];
}

interface PromptBlocksEditorProps {
  agentId: string;
  onChange: () => void;
}

const mockConfiguration: PromptConfiguration = {
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
    {
      id: "1",
      question: "¿Tienen garantía los productos?",
      answer: "Sí, todos nuestros productos incluyen garantía del fabricante"
    },
    {
      id: "2", 
      question: "¿Puedo cambiar mi pedido después de comprarlo?",
      answer: "Puedes modificar tu pedido hasta 2 horas después de la compra"
    }
  ]
};

const styleOptions = [
  { value: "profesional_formal", label: "Profesional y Formal" },
  { value: "profesional_amigable", label: "Profesional y Amigable" },
  { value: "casual_cercano", label: "Casual y Cercano" },
  { value: "experto_tecnico", label: "Experto Técnico" }
];

const toneOptions = [
  { value: "conversacional", label: "Conversacional" },
  { value: "directo", label: "Directo al grano" },
  { value: "consultivo", label: "Consultivo" },
  { value: "entusiasta", label: "Entusiasta" }
];

export const PromptBlocksEditor = ({ agentId, onChange }: PromptBlocksEditorProps) => {
  const [config, setConfig] = useState<PromptConfiguration>(mockConfiguration);
  const { toast } = useToast();

  const updateConfig = (field: keyof PromptConfiguration, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    onChange();
  };

  const addFAQ = () => {
    if (config.faqs.length >= 10) {
      toast({
        title: "Límite alcanzado",
        description: "Solo puedes agregar hasta 10 preguntas frecuentes",
        variant: "destructive"
      });
      return;
    }

    const newFAQ: FAQ = {
      id: Date.now().toString(),
      question: "",
      answer: ""
    };
    updateConfig("faqs", [...config.faqs, newFAQ]);
  };

  const updateFAQ = (id: string, field: keyof FAQ, value: string) => {
    const updatedFAQs = config.faqs.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    );
    updateConfig("faqs", updatedFAQs);
  };

  const removeFAQ = (id: string) => {
    updateConfig("faqs", config.faqs.filter(faq => faq.id !== id));
  };

  const ConfigurationContent = () => (
    <Accordion type="multiple" defaultValue={["personality"]} className="space-y-4">
      
          {/* 1. Personalidad del agente */}
          <AccordionItem value="personality" className="border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                Personalidad del Agente
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Nombre del agente</Label>
                  <Input
                    value={config.agentName}
                    onChange={(e) => updateConfig("agentName", e.target.value)}
                    placeholder="Ej: Sofia, Carlos, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Saludo inicial</Label>
                  <Textarea
                    value={config.initialGreeting}
                    onChange={(e) => updateConfig("initialGreeting", e.target.value)}
                    placeholder="¡Hola! Soy [nombre], tu asistente virtual..."
                    className="min-h-[60px]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Estilo base</Label>
                    <Select value={config.baseStyle} onValueChange={(value) => updateConfig("baseStyle", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {styleOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tono</Label>
                    <Select value={config.tone} onValueChange={(value) => updateConfig("tone", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {toneOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Frases características</Label>
                  <Textarea
                    value={config.characteristicPhrases}
                    onChange={(e) => updateConfig("characteristicPhrases", e.target.value)}
                    placeholder="Frases separadas por comas: ¡Excelente!, Perfecto, etc."
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 2. Sobre la tienda */}
          <AccordionItem value="store" className="border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-green-600" />
                Sobre la Tienda
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Nombre de la tienda</Label>
                <Input
                  value={config.storeName}
                  onChange={(e) => updateConfig("storeName", e.target.value)}
                  placeholder="Nombre de tu tienda"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Descripción</Label>
                <Textarea
                  value={config.storeDescription}
                  onChange={(e) => updateConfig("storeDescription", e.target.value)}
                  placeholder="Describe brevemente tu tienda y lo que ofreces"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Horarios de atención</Label>
                <Input
                  value={config.businessHours}
                  onChange={(e) => updateConfig("businessHours", e.target.value)}
                  placeholder="Lunes a Viernes: 9:00 - 18:00"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Información de contacto</Label>
                <Textarea
                  value={config.contactInfo}
                  onChange={(e) => updateConfig("contactInfo", e.target.value)}
                  placeholder="WhatsApp, email, teléfono, dirección"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 3. Políticas generales */}
          <AccordionItem value="policies" className="border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-600" />
                Políticas Generales
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">URL Política de Privacidad</Label>
                <Input
                  value={config.privacyPolicyUrl}
                  onChange={(e) => updateConfig("privacyPolicyUrl", e.target.value)}
                  placeholder="https://tutienda.com/privacidad"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">URL Términos y Condiciones</Label>
                <Input
                  value={config.termsConditionsUrl}
                  onChange={(e) => updateConfig("termsConditionsUrl", e.target.value)}
                  placeholder="https://tutienda.com/terminos"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 4. Cambios y devoluciones */}
          <AccordionItem value="returns" className="border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-orange-600" />
                Cambios y Devoluciones
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Política de devoluciones</Label>
                <Textarea
                  value={config.returnPolicy}
                  onChange={(e) => updateConfig("returnPolicy", e.target.value)}
                  placeholder="Condiciones para aceptar devoluciones"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tiempo límite</Label>
                <Input
                  value={config.returnTimeframe}
                  onChange={(e) => updateConfig("returnTimeframe", e.target.value)}
                  placeholder="30 días, 15 días, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Proceso de devolución</Label>
                <Textarea
                  value={config.returnProcess}
                  onChange={(e) => updateConfig("returnProcess", e.target.value)}
                  placeholder="Pasos que debe seguir el cliente para devolver un producto"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 5. Envíos y entregas */}
          <AccordionItem value="shipping" className="border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-600" />
                Envíos y Entregas
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Opciones de envío</Label>
                <Textarea
                  value={config.shippingOptions}
                  onChange={(e) => updateConfig("shippingOptions", e.target.value)}
                  placeholder="Envío estándar, express, recogida en tienda"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tiempos de entrega</Label>
                <Textarea
                  value={config.deliveryTimes}
                  onChange={(e) => updateConfig("deliveryTimes", e.target.value)}
                  placeholder="Estándar: 3-5 días, Express: 1-2 días"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Costos de envío</Label>
                <Textarea
                  value={config.shippingCosts}
                  onChange={(e) => updateConfig("shippingCosts", e.target.value)}
                  placeholder="Precios por tipo de envío y condiciones"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 6. Opciones de pago */}
          <AccordionItem value="payment" className="border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-600" />
                Opciones de Pago
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Métodos de pago</Label>
                <Textarea
                  value={config.paymentMethods}
                  onChange={(e) => updateConfig("paymentMethods", e.target.value)}
                  placeholder="Tarjetas, PSE, efectivo, transferencia, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Seguridad de pagos</Label>
                <Textarea
                  value={config.paymentSecurity}
                  onChange={(e) => updateConfig("paymentSecurity", e.target.value)}
                  placeholder="Información sobre la seguridad de los pagos"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 7. Preguntas frecuentes */}
          <AccordionItem value="faqs" className="border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-indigo-600" />
                Preguntas Frecuentes ({config.faqs.length}/10)
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Agrega hasta 10 preguntas frecuentes</p>
                <Button 
                  size="sm" 
                  onClick={addFAQ}
                  disabled={config.faqs.length >= 10}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {config.faqs.map((faq, index) => (
                <div key={faq.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">FAQ #{index + 1}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFAQ(faq.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Pregunta</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) => updateFAQ(faq.id, "question", e.target.value)}
                      placeholder="¿Cuál es tu pregunta?"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Respuesta</Label>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(faq.id, "answer", e.target.value)}
                      placeholder="Respuesta detallada a la pregunta"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              ))}
              
              {config.faqs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <HelpCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No hay preguntas frecuentes configuradas</p>
                  <p className="text-xs text-gray-400">Agrega algunas para ayudar a tus clientes</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
  );

  return (
    <Card className="h-fit bg-white/70 backdrop-blur-sm border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Configuración del Agente
            </CardTitle>
            <CardDescription className="text-gray-600">
              Personaliza la información y comportamiento del agente
            </CardDescription>
          </div>
          
          <Drawer>
            <DrawerTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className="hover:bg-blue-50"
                title="Expandir configuración"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[90vh]">
              <DrawerHeader>
                <DrawerTitle className="text-xl font-semibold">
                  Configuración Completa del Agente
                </DrawerTitle>
              </DrawerHeader>
              <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <ConfigurationContent />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </CardHeader>
      <CardContent>
        <ConfigurationContent />
      </CardContent>
    </Card>
  );
};
