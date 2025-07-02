
import { BASE_STYLE_DESCRIPTIONS, mockAgentConfig } from './constants';

interface Tool {
  id: string;
  name: string;
  enabled: boolean;
}

interface PromptRendererProps {
  prompt: string;
  enabledTools: Tool[];
  showPreview: boolean;
  useSystemGenerated: boolean;
}

export const renderPromptWithHighlighting = (prompt: string, config: typeof mockAgentConfig, enabledTools: Tool[]): JSX.Element => {
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

export const renderPromptWithVariableHighlighting = (prompt: string, enabledTools: Tool[]): JSX.Element => {
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
