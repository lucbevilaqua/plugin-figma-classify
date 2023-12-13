import { handleGenerateCodeSession } from '@handlers/generatesCode';
import { PluginMessage } from '@typings/pluginMessages'
import { Config, CustomConfig } from '@typings/config';

let config: Config = JSON.parse(figma.root.getPluginData('config') || '{}')
let currentComponentIndex = 0;
const components = figma.currentPage.findAll(node => node.type === 'COMPONENT_SET') as Array<ComponentSetNode>;
let customComponent: Array<CustomConfig> = []

// initiate UI
if (figma.editorType !== 'dev') {
  figma.showUI(__html__, { themeColors: false, height: 700, width: 600})
}

// Listerners
figma.codegen.on("generate", () => generateCodeSession());
figma.ui.onmessage = (msg: PluginMessage) => {
  switch (msg.action) {
    case 'getConfig':
      figma.ui.postMessage({ action: msg.action, payload: config});
      break;
    case 'getAllComponents':
      figma.ui.postMessage({ action: msg.action, payload: components.map(mapFigmaComponentToCustomConfig)});
      break;
    case 'setCustomComponents':
      customComponent = msg.payload
      focusOnCurrentComponent()
      break;
    case 'saveConfigDefault':
      config = msg.payload as Config
      figma.root.setPluginData('config', JSON.stringify(config))
      break;
    case 'saveConfig':
      const name = msg.payload?.name ?? ''
      config.custom = { ...config.custom, [name]: msg.payload}
      figma.root.setPluginData('config', JSON.stringify(config))
      goToNextComponent();
      break;

    default:
      break;
  }
};

//Handlers
const generateCodeSession = (): CodegenResult[] => {
  const selection = figma.currentPage.selection[0];
  return handleGenerateCodeSession(config, selection);
}

function goToNextComponent() {
  if (currentComponentIndex < customComponent.length - 1) {
    currentComponentIndex++;
    focusOnCurrentComponent();
  } else {
    figma.notify('All components were visited.')
  }
}

function mapFigmaComponentToCustomConfig(component: ComponentSetNode): CustomConfig {
  let properties: Record<string, any> = {};
  if ('variantProperties' in component && component.variantProperties) {
    properties = component.variantProperties;
  } else if ('variantGroupProperties' in component && component.variantGroupProperties) {
    properties = component.variantGroupProperties;
  }
  
  const componentData: CustomConfig = {
    key: component.key,
    name: component.name,
    properties
  };

  return componentData
}

function sendComponentDataToUI(component: ComponentSetNode) {
  let properties: Record<string, any> = {};
  if ('variantProperties' in component && component.variantProperties) {
    properties = component.variantProperties;
  } else if ('variantGroupProperties' in component && component.variantGroupProperties) {
    properties = component.variantGroupProperties;
  }
  if (!Object.keys(properties).length) {
    currentComponentIndex++;
    return focusOnCurrentComponent()
  }

  const componentData: CustomConfig = mapFigmaComponentToCustomConfig(component)

  if (!Object.keys(componentData.properties).length) {
    currentComponentIndex++;
    return focusOnCurrentComponent()
  }
  setTimeout(() => figma.ui.postMessage({ action: 'currentComponent', payload: componentData}));
}

function focusOnCurrentComponent() {
  const currentComponent = customComponent[currentComponentIndex];
  const component = components.find(c => c.key === currentComponent.key)
  if (component) {
    figma.viewport.scrollAndZoomIntoView([component]);
    sendComponentDataToUI(component);
  }
}
