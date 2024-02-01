import { Config, CustomConfig } from "@typings/config";
import { getPluginCollection } from "./utils";
import { PluginMessage } from '@typings/pluginMessages'
import { getGenerateCodeComponentExemple } from "./generate";

const collection: VariableCollection = getPluginCollection();
const components = figma.currentPage.findAll(node => node.type === 'COMPONENT_SET') as Array<ComponentSetNode>;
let config: Config = JSON.parse(collection.getPluginData('config') || '{}')

const mapMessages: Record<string, (msg: PluginMessage) => void> = {
  getConfig: (msg: PluginMessage) => figma.ui.postMessage({ action: msg.action, payload: config}),
  getAllComponents: handleGetAllComponents,
  setComponentFocus: handleSetComponentFocus,
  saveConfigDefault: handleSaveConfigDefault,
  saveConfig: handleSaveConfig,
  generateCodeExemple: (msg: PluginMessage) => getGenerateCodeComponentExemple(msg.payload.name, msg.payload.form),
}

// Listeners
figma.ui.onmessage = (msg: PluginMessage) => {
  mapMessages[msg.action](msg)
};

// handlers
function handleGetAllComponents(msg: PluginMessage) {
  const componentList = components.map(mapFigmaComponentToCustomConfig);
  figma.ui.postMessage({ action: msg.action, payload: componentList})
}

function handleSetComponentFocus(msg: PluginMessage) {
  const key = msg.payload;
  focusOnCurrentComponent(key);
}

export function handleSaveConfigDefault(msg: PluginMessage) {
  config = msg.payload as Config;
  collection.setPluginData('config', JSON.stringify(config));
  figma.notify('Config Default Saved.')
}

function handleSaveConfig(msg: PluginMessage) {
  const name = msg.payload?.name ?? ''
  config.custom = { ...config.custom, [name]: msg.payload}
  collection.setPluginData('config', JSON.stringify(config))

  figma.notify(`Config to ${name} saved.`)
}

function mapFigmaComponentToCustomConfig(component: ComponentSetNode): CustomConfig {
  let properties: Record<string, any> = {};
  if ('variantProperties' in component && component.variantProperties) {
    properties = component.variantProperties;
  } else if ('variantGroupProperties' in component && component.variantGroupProperties) {
    properties = component.variantGroupProperties;
  }

  if(config.custom?.[component.name]) {
    properties = { ...config.custom[component.name].properties }
  } else {
    for (const key in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key)) {
        properties[key] = { type: 'property', mask: '$propertyName="$value"' }
      }
    }
  }
  
  const componentData: CustomConfig = {
    key: component.key,
    name: component.name,
    properties
  };

  return componentData
}

function focusOnCurrentComponent(key: string) {
  const component = components.find(c => c.key === key)
  if (component) {
    figma.viewport.scrollAndZoomIntoView([component]);
  }
}
