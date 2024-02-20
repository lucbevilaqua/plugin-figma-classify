import { getPluginCollection } from '@src/utils';
import { Config, CustomConfig } from '@typings/config';
import { FigmaComponentProperties } from '@typings/figma';

const configDefault = {
  cssClass: '$prefix-$value',
  directive: 'is$value',
  property: '$propertyName="$value"'
}
const collection: VariableCollection = getPluginCollection();
const config: Config = JSON.parse(collection.getPluginData('config') || JSON.stringify({ custom: {} }));
let selection: SceneNode = figma.currentPage.selection[0];

// Handlers
export const handleSelectionChange = () => {
  if (figma.editorType !== 'dev') {
    figma.ui.postMessage({ action: 'selectionChange', payload: { code: getCodegen()} })
    return;
  } 
  
  handleGenerateCodeSession()
}

const handleGenerateCodeSession = (): CodegenResult[] => {
  const codegenResult: Array<CodegenResult> = []
  const code = getCodegen()

  if(code === null) {
    return []
  }

  codegenResult.push({
    language: 'HTML',
    code,
    title: 'Component Exemple'
  })

  return codegenResult;
}

export function getCodegen(): string | null {
  selection = figma.currentPage.selection[0]
  let code = null;

  if (!selection || selection.type !== 'INSTANCE') {
    return code;
  }

  if(config.custom?.[selection.name]) {
    code = handleGenerateCodeComponent(selection.name, selection.variantProperties ?? {})
  } else {
    code = handleGenerateCodeFromFigma(selection.name, selection.variantProperties ?? {})
  }

  return code;
}

function handleGenerateCodeComponent(componentName: string, componentProperties: FigmaComponentProperties): string | null {
  const prefix: string = collection.getPluginData('prefix')

  const customConfig: CustomConfig = config.custom![componentName]

  const properties = customConfig.properties
  let attributes = '';
  let classCss = '';

  for (const key in properties) {
    if (Object.prototype.hasOwnProperty.call(properties, key)) {
      const element = properties[key];
      const value = componentProperties[key]
      const code = element.values.find((item) => item.value === value)?.code

      if (element.type === 'cssClass') {
        classCss += ` ${code}`;
        classCss = classCss.replace('$propertyName', key)
        classCss = classCss.replace('$value', value.toString())
      } else {
        attributes += ` ${code}`;
        attributes = attributes.replace('$propertyName', key)
        attributes = attributes.replace('$value', value.toString())
      }
    }
  }

  let componentTag = customConfig.tag ? customConfig.tag : 'span';
  componentTag = componentTag.replace('$prefix', prefix);
  attributes = attributes.replace('$prefix', prefix)
  classCss = classCss.replace('$prefix', prefix)

  return`<${componentTag} ${classCss && `class="${classCss.trimStart()}"`}${attributes}></${componentTag}>`;
}

function handleGenerateCodeFromFigma(componentName: string, componentProperties: FigmaComponentProperties): string | null {
  const prefix: string = collection.getPluginData('prefix') ?? 'app'
  const tagName = prefix ? `${prefix}-${componentName}` : componentName;
  let attributes = '';

  if (!componentProperties && !componentName) {
    return null
  }

  for (const key in componentProperties) {
    const value = componentProperties[key]
   
    attributes += ` ${configDefault.property}`;
    attributes = attributes.replace('$propertyName', key)
    attributes = attributes.replace('$value', value.toString())
  }
  attributes = attributes.replace('$prefix', prefix)

  return `<${tagName}${attributes}></${tagName}>`;
};

// Listeners
figma.codegen.on("generate", () => handleGenerateCodeSession());
figma.on("selectionchange", handleSelectionChange);
