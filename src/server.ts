import { Config, CustomConfig } from "@typings/config";
import { toCamelCase } from "./utils";
import { PluginMessage } from '@typings/pluginMessages'
import { collection, getConfig } from "./main";

const components = figma.currentPage.findAll(node => node.type === 'COMPONENT_SET') as Array<ComponentSetNode>;
const instances = figma.currentPage.findAll(node => node.type === 'INSTANCE') as Array<InstanceNode>;

const mapMessages: Record<string, (msg: PluginMessage) => void> = {
  getAllComponents: handleGetAllComponents,
  setComponentFocus: handleSetComponentFocus,
  saveConfig: handleSaveConfig,
  deleteComponentConfig: handleDeleteComponentConfig,
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

function handleSaveConfig(msg: PluginMessage) {
  const name = msg.payload?.name ?? ''
  const config = getConfig();
  config.custom = { ...config.custom, [name]: msg.payload}
  collection.setPluginData('config', JSON.stringify(config))
  figma.notify(`Config to ${name} saved.`)
}

function handleDeleteComponentConfig(msg: PluginMessage) {
  const name = msg.payload?.name ?? ''
  const config = getConfig();
  delete config.custom![name]

  collection.setPluginData('config', JSON.stringify(config))

  figma.notify(`Config to ${name} reseted.`)
  handleGetAllComponents({ action: 'getAllComponents' })
}

function mapFigmaComponentToCustomConfig(component: ComponentSetNode): CustomConfig | null {
  const config = getConfig();
  let properties: Record<string, any> = {};
  const name = toCamelCase(component.name);
  let tag = `$prefix-${name}`;
  if ('variantGroupProperties' in component && component.variantGroupProperties) {
    properties = component.variantGroupProperties;
  } else {
    return null;
  }
  
  if(config.custom?.[component.name]) {
    properties = config.custom[component.name].properties
    tag = config.custom[component.name].tag
  } else {
    for (const key in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key)) {
        const values = properties[key].values.map((value: string) => ({ value, code: '$propertyName="$value"' }));
        properties[key] = { type: 'property', values }
      }
    }
  }

  const componentData: CustomConfig = {
    key: component.key,
    name: component.name,
    tag,
    properties
  };

  return componentData
}

function mapFigmaIntanceToCustomConfig(instance: InstanceNode): CustomConfig | null {
  const component = instance?.mainComponent?.parent as ComponentSetNode;

  if (component?.variantGroupProperties) {
    return mapFigmaComponentToCustomConfig(component)
  }
  
  return null
}

function focusOnCurrentComponent(key: string) {
  const component = components.find(c => c.key === key)
  if (component) {
    figma.viewport.scrollAndZoomIntoView([component]);
  }
}
