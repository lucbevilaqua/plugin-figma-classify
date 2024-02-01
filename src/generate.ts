import { getPluginCollection } from '@src/utils';
import { Config, CustomConfig, GeneralConfig } from '@typings/config';
import { FigmaComponentProperties } from '@typings/figma';

const configDefault: Config = {
  general: {
    cssClass: '$propertyName',
    directive: 'is$value',
    property: '$propertyName="$value"'
  }
}
const collection: VariableCollection = getPluginCollection();
const config: Config = JSON.parse(collection.getPluginData('config') || JSON.stringify(configDefault))
const selection: SceneNode = figma.currentPage.selection[0];

// Listeners
figma.codegen.on("generate", () => handleGenerateCodeSession());

// Handlers
const handleGenerateCodeSession = (): CodegenResult[] => {
  const codegenResult: Array<CodegenResult> = []

  if (selection.type !== 'INSTANCE') {
    return []
  }

  if(config.custom?.[selection.name]) {
    return handleGenerateCodeComponent(selection.name, selection.variantProperties ?? {})
  } else {
    const code = handleGenerateCodeFromFigma(selection.name, selection.variantProperties ?? {})
    code && codegenResult.push({
      language: 'HTML',
      code,
      title: 'Component Exemple'
    })   
  }

  return codegenResult;
}

export function getGenerateCodeComponentExemple(componentName: string, properties: any): void{
  const prefix: string = collection.getPluginData('prefix')

  const tagName = prefix ? `${prefix}-${componentName}` : componentName;
  let attributes = '';
  let classCss = '';

  for (const key in properties) {
    if (Object.prototype.hasOwnProperty.call(properties, key)) {
      const element = properties[key];

      if (element.type === 'cssClass') {
        classCss += ` ${element.mask}`;
        classCss = classCss.replace('$propertyName', key)
        classCss = classCss.replace('$value', 'Apple')
      } else if (element.type !== 'code') {
        attributes += ` ${element.mask}`;
        attributes = attributes.replace('$propertyName', key)
        attributes = attributes.replace('$value', 'Apple')
      }
    }
  }

  attributes = attributes.replace('$prefix', prefix)
  classCss = classCss.replace('$prefix', prefix)
  const codeExemple = `<${tagName} ${classCss && `class="${classCss.trimStart()}"`}${attributes}></${tagName}>`;
  setTimeout(() => figma.ui.postMessage({ action: 'getGenerateCodeExemple', payload: { code: codeExemple } }));
}

function handleGenerateCodeComponent(componentName: string, componentProperties: FigmaComponentProperties): Array<CodegenResult> {
  const codegenResult: Array<CodegenResult> = []

  const prefix: string = collection.getPluginData('prefix')

  const tagName = prefix ? `${prefix}-${componentName}` : componentName;
  const customConfig: CustomConfig = config.custom![componentName]

  const properties = customConfig.properties
  let attributes = '';
  let classCss = '';

  for (const key in properties) {
    if (Object.prototype.hasOwnProperty.call(properties, key)) {
      const element = properties[key];

      if (element.type === 'code') {
        codegenResult.push({
          language: 'HTML',
          code: element.code!,
          title: `Code exemple to property ${key}`
        })
      } else if (element.type === 'cssClass') {
        classCss += ` ${element.mask}`;
        classCss = classCss.replace('$propertyName', key)
        classCss = classCss.replace('$value', componentProperties[key].toString())
      } else {
        attributes += ` ${element.mask}`;
        attributes = attributes.replace('$propertyName', key)
        attributes = attributes.replace('$value', componentProperties[key].toString())
      }
    }
  }

  attributes = attributes.replace('$prefix', prefix)
  classCss = classCss.replace('$prefix', prefix)
  const componentTag = customConfig.hasComponentNameTag ? tagName : 'span';

  const code = `<${componentTag} ${classCss && `class="${classCss.trimStart()}"`}${attributes}></${componentTag}>`;

  codegenResult.push({
    language: 'HTML',
    code,
    title: 'Component exemple'
  })

  return codegenResult;
}

function handleGenerateCodeFromFigma(componentName: string, componentProperties: FigmaComponentProperties): string | null {
  const prefix: string = collection.getPluginData('prefix')
  const tagName = prefix ? `${prefix}-${componentName}` : componentName;
  const generalConfig: GeneralConfig = config.general
  let attributes = '';

  if (!componentProperties && !componentName) {
    return null
  }

  for (const key in componentProperties) {
    const value = componentProperties[key]
   
    attributes += ` ${generalConfig.property}`;
    attributes = attributes.replace('$propertyName', key)
    attributes = attributes.replace('$value', value.toString())
  }
  attributes = attributes.replace('$prefix', prefix)

  return `<${tagName}${attributes}></${tagName}>`;
};
