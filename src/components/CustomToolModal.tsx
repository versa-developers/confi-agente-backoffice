
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Play, Code, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (toolData: any) => void;
}

interface Header {
  key: string;
  value: string;
}

export const CustomToolModal = ({ isOpen, onClose, onSave }: CustomToolModalProps) => {
  const [toolData, setToolData] = useState({
    name: "",
    description: "",
    type: "webhook",
    method: "POST",
    url: "",
    headers: [] as Header[],
    body: "",
    variables: [] as string[]
  });
  const [testResponse, setTestResponse] = useState("");
  const [isTestingTool, setIsTestingTool] = useState(false);
  const { toast } = useToast();

  const availableVariables = [
    "user_message", "user_id", "conversation_id", "timestamp", 
    "seller_id", "agent_id", "session_data"
  ];

  const addHeader = () => {
    setToolData({
      ...toolData,
      headers: [...toolData.headers, { key: "", value: "" }]
    });
  };

  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    const newHeaders = [...toolData.headers];
    newHeaders[index][field] = value;
    setToolData({ ...toolData, headers: newHeaders });
  };

  const removeHeader = (index: number) => {
    setToolData({
      ...toolData,
      headers: toolData.headers.filter((_, i) => i !== index)
    });
  };

  const addVariable = (variable: string) => {
    if (!toolData.variables.includes(variable)) {
      setToolData({
        ...toolData,
        variables: [...toolData.variables, variable]
      });
    }
  };

  const removeVariable = (variable: string) => {
    setToolData({
      ...toolData,
      variables: toolData.variables.filter(v => v !== variable)
    });
  };

  const testTool = async () => {
    setIsTestingTool(true);
    setTestResponse("");
    
    try {
      // Simulamos una respuesta de prueba
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTestResponse(JSON.stringify({
        success: true,
        data: {
          message: "Tool ejecutada correctamente",
          timestamp: new Date().toISOString(),
          result: "Datos de prueba obtenidos exitosamente"
        }
      }, null, 2));
      
      toast({
        title: "Prueba exitosa",
        description: "La tool personalizada respondió correctamente.",
      });
    } catch (error) {
      setTestResponse(JSON.stringify({
        error: true,
        message: "Error al ejecutar la tool",
        details: "Verifique la configuración y URL"
      }, null, 2));
      
      toast({
        title: "Error en la prueba",
        description: "No se pudo ejecutar la tool personalizada.",
        variant: "destructive",
      });
    } finally {
      setIsTestingTool(false);
    }
  };

  const handleSave = () => {
    if (!toolData.name || !toolData.url) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa el nombre y la URL de la tool.",
        variant: "destructive",
      });
      return;
    }

    onSave(toolData);
    
    // Reset form
    setToolData({
      name: "",
      description: "",
      type: "webhook",
      method: "POST",
      url: "",
      headers: [],
      body: "",
      variables: []
    });
    setTestResponse("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-600" />
            Crear Tool Personalizada
          </DialogTitle>
          <DialogDescription>
            Configura una herramienta personalizada mediante webhook o API externa
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="config" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config">Configuración</TabsTrigger>
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="test">Pruebas</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la tool *</Label>
                <Input
                  id="name"
                  value={toolData.name}
                  onChange={(e) => setToolData({ ...toolData, name: e.target.value })}
                  placeholder="ej: Consultar Inventario"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={toolData.type}
                  onValueChange={(value) => setToolData({ ...toolData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="api">API Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={toolData.description}
                onChange={(e) => setToolData({ ...toolData, description: e.target.value })}
                placeholder="Describe qué hace esta tool y cuándo utilizarla"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Variables del contexto disponibles</Label>
              <div className="flex flex-wrap gap-2">
                {availableVariables.map((variable) => (
                  <Badge
                    key={variable}
                    variant={toolData.variables.includes(variable) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => toolData.variables.includes(variable) 
                      ? removeVariable(variable) 
                      : addVariable(variable)
                    }
                  >
                    {variable}
                  </Badge>
                ))}
              </div>
              {toolData.variables.length > 0 && (
                <p className="text-xs text-gray-600">
                  Variables seleccionadas: {toolData.variables.join(", ")}
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="request" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="method">Método HTTP</Label>
                <Select
                  value={toolData.method}
                  onValueChange={(value) => setToolData({ ...toolData, method: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="url">URL del endpoint *</Label>
                <Input
                  id="url"
                  value={toolData.url}
                  onChange={(e) => setToolData({ ...toolData, url: e.target.value })}
                  placeholder="https://api.ejemplo.com/endpoint"
                />
              </div>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Headers</CardTitle>
                  <Button size="sm" variant="outline" onClick={addHeader}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Header
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {toolData.headers.map((header, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Clave"
                      value={header.key}
                      onChange={(e) => updateHeader(index, "key", e.target.value)}
                    />
                    <Input
                      placeholder="Valor"
                      value={header.value}
                      onChange={(e) => updateHeader(index, "value", e.target.value)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeHeader(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {toolData.headers.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay headers configurados
                  </p>
                )}
              </CardContent>
            </Card>

            {(toolData.method === "POST" || toolData.method === "PUT") && (
              <div className="space-y-2">
                <Label htmlFor="body">Body (JSON)</Label>
                <Textarea
                  id="body"
                  value={toolData.body}
                  onChange={(e) => setToolData({ ...toolData, body: e.target.value })}
                  placeholder={`{
  "user_id": "{user_id}",
  "message": "{user_message}",
  "timestamp": "{timestamp}"
}`}
                  className="font-mono text-sm"
                  rows={8}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Probar Tool
                </CardTitle>
                <CardDescription>
                  Ejecuta la tool con datos de prueba para verificar su funcionamiento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={testTool}
                  disabled={!toolData.url || isTestingTool}
                  className="w-full"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isTestingTool ? "Ejecutando..." : "Probar Tool"}
                </Button>

                {testResponse && (
                  <div className="space-y-2">
                    <Label>Respuesta:</Label>
                    <Textarea
                      value={testResponse}
                      readOnly
                      className="font-mono text-xs"
                      rows={10}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Crear Tool
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
