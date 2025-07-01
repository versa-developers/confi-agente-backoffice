
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Type, Hash, ToggleLeft, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromptBlock {
  id: string;
  name: string;
  key: string;
  type: "text" | "number" | "boolean" | "date";
  value: string | number | boolean;
  description?: string;
}

interface PromptBlocksEditorProps {
  agentId: string;
  onChange: () => void;
}

const mockPromptBlocks: PromptBlock[] = [
  {
    id: "1",
    name: "Horario de atención",
    key: "store_hours",
    type: "text",
    value: "Lunes a Viernes 9:00 - 18:00",
    description: "Horarios de atención al cliente"
  },
  {
    id: "2",
    name: "Política de envíos",
    key: "shipping_policy",
    type: "text",
    value: "Envío gratis en compras mayores a $50.000",
    description: "Información sobre envíos"
  },
  {
    id: "3",
    name: "Descuento activo",
    key: "discount_active",
    type: "boolean",
    value: true,
    description: "Si hay descuentos vigentes"
  },
  {
    id: "4",
    name: "Días de entrega",
    key: "delivery_days",
    type: "number",
    value: 3,
    description: "Días estimados de entrega"
  }
];

const typeIcons = {
  text: Type,
  number: Hash,
  boolean: ToggleLeft,
  date: Calendar
};

export const PromptBlocksEditor = ({ agentId, onChange }: PromptBlocksEditorProps) => {
  const [blocks, setBlocks] = useState<PromptBlock[]>(mockPromptBlocks);
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const { toast } = useToast();

  const addNewBlock = () => {
    const newBlock: PromptBlock = {
      id: Date.now().toString(),
      name: "",
      key: "",
      type: "text",
      value: "",
      description: ""
    };
    setBlocks([...blocks, newBlock]);
    setIsAddingBlock(true);
    onChange();
  };

  const updateBlock = (id: string, updates: Partial<PromptBlock>) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
    onChange();
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
    toast({
      title: "Bloque eliminado",
      description: "El prompt block se ha eliminado correctamente.",
    });
    onChange();
  };

  const renderValueInput = (block: PromptBlock) => {
    switch (block.type) {
      case "boolean":
        return (
          <Switch
            checked={block.value as boolean}
            onCheckedChange={(value) => updateBlock(block.id, { value })}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={block.value as number}
            onChange={(e) => updateBlock(block.id, { value: parseInt(e.target.value) || 0 })}
            className="text-sm"
          />
        );
      default:
        return (
          <Input
            value={block.value as string}
            onChange={(e) => updateBlock(block.id, { value: e.target.value })}
            className="text-sm"
            placeholder="Valor del bloque"
          />
        );
    }
  };

  return (
    <Card className="h-fit bg-white/70 backdrop-blur-sm border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Prompt Blocks
            </CardTitle>
            <CardDescription className="text-gray-600">
              Variables configurables del agente
            </CardDescription>
          </div>
          <Button size="sm" onClick={addNewBlock} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {blocks.map((block) => {
          const IconComponent = typeIcons[block.type];
          return (
            <div
              key={block.id}
              className="p-4 border border-gray-200 rounded-lg bg-white/50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-gray-500" />
                  <Badge variant="outline" className="text-xs">
                    {block.type}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteBlock(block.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Nombre</Label>
                <Input
                  value={block.name}
                  onChange={(e) => updateBlock(block.id, { name: e.target.value })}
                  placeholder="Nombre del bloque"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Clave ({block.key && `{${block.key}}`})</Label>
                <Input
                  value={block.key}
                  onChange={(e) => updateBlock(block.id, { key: e.target.value.replace(/\s/g, '_').toLowerCase() })}
                  placeholder="clave_del_bloque"
                  className="text-sm font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo</Label>
                <Select
                  value={block.type}
                  onValueChange={(value: PromptBlock["type"]) => 
                    updateBlock(block.id, { type: value, value: value === "boolean" ? false : value === "number" ? 0 : "" })
                  }
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="boolean">Booleano</SelectItem>
                    <SelectItem value="date">Fecha</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Valor</Label>
                {renderValueInput(block)}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Descripción</Label>
                <Input
                  value={block.description || ""}
                  onChange={(e) => updateBlock(block.id, { description: e.target.value })}
                  placeholder="Descripción opcional"
                  className="text-sm"
                />
              </div>
            </div>
          );
        })}

        {blocks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Type className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No hay prompt blocks configurados</p>
            <p className="text-xs text-gray-400">Agrega variables para personalizar el prompt</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
