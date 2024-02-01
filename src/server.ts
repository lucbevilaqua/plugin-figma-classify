import { Config, CustomConfig } from "@typings/config";
import { getPluginCollection } from "./utils";
import { PluginMessage } from '@typings/pluginMessages'
import { getGenerateCodeComponentExemple } from "./generate";

const collection: VariableCollection = getPluginCollection();
const components = figma.currentPage.findAll(node => node.type === 'COMPONENT_SET') as Array<ComponentSetNode>;
const instances = figma.currentPage.findAll(node => node.type === 'INSTANCE') as Array<InstanceNode>;
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
  const instancesList = instances.map(mapFigmaIntanceToCustomConfig);
  const list = componentList.concat(instancesList).filter(Boolean)
  // Create a Set to track seen names
  const seen = new Set();

  // Filter out duplicates
  const uniqueList = list.filter(item => {
    if (seen.has(item!.name)) {
      return false;
    } else {
      seen.add(item!.name);
      return true;
    }
  });

  figma.ui.postMessage({ action: msg.action, payload: uniqueList })
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

function mapFigmaComponentToCustomConfig(component: ComponentSetNode): CustomConfig | null {
  let properties: Record<string, any> = {};
  let hasComponentNameTag = true;
  if ('variantProperties' in component && component.variantProperties) {
    properties = component.variantProperties;
  } else if ('variantGroupProperties' in component && component.variantGroupProperties) {
    properties = component.variantGroupProperties;
  } else {
    return null;
  }
  
  if(config.custom?.[component.name]) {
    properties = { ...config.custom[component.name].properties }
    hasComponentNameTag = config.custom[component.name].hasComponentNameTag ?? true
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
    hasComponentNameTag,
    properties
  };

  return componentData
}

function mapFigmaIntanceToCustomConfig(instance: InstanceNode): CustomConfig | null {
  let properties: Record<string, any> = {};
  let hasComponentNameTag = true;
  
  if ('variantProperties' in instance && instance.variantProperties) {
    properties = instance.variantProperties;
  } else {
    return null;
  }

  if(config.custom?.[instance.name]) {
    properties = { ...config.custom[instance.name].properties }
    hasComponentNameTag = config.custom[instance.name].hasComponentNameTag ?? true
  } else {
    for (const key in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key)) {
        properties[key] = { type: 'property', mask: '$propertyName="$value"' }
      }
    }
  }
  
  const instanceData: CustomConfig = {
    key: instance.mainComponent?.key ?? instance.name,
    name: instance.name,
    hasComponentNameTag,
    properties
  };

  return instanceData
}

function focusOnCurrentComponent(key: string) {
  const component = components.find(c => c.key === key)
  if (component) {
    figma.viewport.scrollAndZoomIntoView([component]);
  }
}
