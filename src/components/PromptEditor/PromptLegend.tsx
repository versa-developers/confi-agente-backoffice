
import { FileText } from "lucide-react";

interface PromptLegendProps {
  useSystemGenerated: boolean;
  enabledToolsCount: number;
  totalToolsCount: number;
}

export const PromptLegend = ({ useSystemGenerated, enabledToolsCount, totalToolsCount }: PromptLegendProps) => {
  return (
    <>
      {/* Legend for variables */}
      {useSystemGenerated ? (
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
                  <span>Herramientas activas ({enabledToolsCount} de {totalToolsCount})</span>
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
    </>
  );
};
