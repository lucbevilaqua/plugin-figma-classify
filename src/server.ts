import { Config, CustomConfig } from "@typings/config";
import { getPluginCollection } from "./utils";
import { PluginMessage } from '@typings/pluginMessages'

const collection: VariableCollection = getPluginCollection();
const components = figma.currentPage.findAll(node => node.type === 'COMPONENT_SET') as Array<ComponentSetNode>;
let config: Config = JSON.parse(collection.getPluginData('config') || '{}')

const mapMessages: Record<string, (msg: PluginMessage) => void> = {
  getConfig: (msg: PluginMessage) => figma.ui.postMessage({ action: msg.action, payload: config}),
  getAllComponents: (msg: PluginMessage) => figma.ui.postMessage({ action: msg.action, payload: components.map(mapFigmaComponentToCustomConfig)}),
  setCustomComponents: handleSetCustomComponents,
  saveConfigDefault: handleSaveConfigDefault,
  saveConfig: handleSaveConfig
}

// Listeners
figma.ui.onmessage = (msg: PluginMessage) => {
  mapMessages[msg.action](msg)
};

// handlers
function handleSetCustomComponents(msg: PluginMessage) {
  customComponent = msg.payload;
  focusOnCurrentComponent();
}

export function handleSaveConfigDefault(msg: PluginMessage) {
  const prefix = collection.getPluginData('prefix')
  config = msg.payload as Config;
  config.prefix = prefix;
  collection.setPluginData('config', JSON.stringify(config));
}

function handleSaveConfig(msg: PluginMessage) {
  const name = msg.payload?.name ?? ''
  config.custom = { ...config.custom, [name]: msg.payload}
  collection.setPluginData('config', JSON.stringify(config))
  goToNextComponent();
}

let customComponent: Array<CustomConfig> = []
let currentComponentIndex = 0;

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
