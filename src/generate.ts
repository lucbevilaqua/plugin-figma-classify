import { getPluginCollection } from '@src/utils';
import { Config, CustomConfig } from '@typings/config';
import { FigmaComponentProperties, FigmaToCodeResponse } from '@typings/figma';

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
    figma.ui.postMessage({ action: 'selectionChange', payload: figmaToCode() })
    return;
  } 
  
  handleGenerateCodeFigmaSession()
}

const handleGenerateCodeFigmaSession = (): CodegenResult[] => {
  const codegenResult: Array<CodegenResult> = []
  const code = figmaToCode() ?? { tag: null }

  if(code.tag === null) {
    return []
  }

  codegenResult.push({
    language: 'HTML',
    code: code.tag,
    title: 'Component Exemple'
  })

  return codegenResult;
}

export function figmaToCode(): FigmaToCodeResponse | null {
  selection = figma.currentPage.selection[0]
  let code = null;

  if (!selection || selection.type !== 'INSTANCE') {
    return code;
  }

  if(config.custom?.[selection.name]) {
    code = mapConfiguredFigmaComponentToHTML(selection.name, selection.variantProperties ?? {})
  } else {
    code = mapDefaultFigmaComponentToHTML(selection.name, selection.variantProperties ?? {})
  }

  const response: FigmaToCodeResponse = { tag: code, fills: selection.fills, absoluteBoundingBox: selection.absoluteBoundingBox, children: [ ...selection.children] }

  return response;
}

function mapConfiguredFigmaComponentToHTML(componentName: string, componentProperties: FigmaComponentProperties): string {
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

function mapDefaultFigmaComponentToHTML(componentName: string, componentProperties: FigmaComponentProperties): string | null {
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
figma.codegen.on("generate", () => handleGenerateCodeFigmaSession());
figma.on("selectionchange", handleSelectionChange);
