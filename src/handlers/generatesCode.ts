import { Config, CustomConfig, GeneralConfig } from '@typings/config';
import { FigmaComponentProperties } from '@typings/figma';

let config: Config;

function handleGenerateCodeComponent(componentName: string, componentProperties: FigmaComponentProperties): string | null {
  const tagName = config.prefix ? `${config.prefix}-${componentName}` : componentName;
  if (config.custom?.[componentName])  {
    const customConfig: CustomConfig = config.custom[componentName]
    const properties = customConfig.properties
    let attributes = '';
    let classCss = '';

    for (const key in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key)) {
        const element = properties[key];

        if (element.type === 'cssClass') {
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

    attributes = attributes.replace('$prefix', config.prefix)
    classCss = classCss.replace('$prefix', config.prefix)
  
    return `<${tagName} ${classCss && `class="${classCss}"`}${attributes}></${tagName}>`;
  } else {
    return handleGenerateCodeFromFigma(componentName, componentProperties);
  }
}

function handleGenerateCodeFromFigma(componentName: string, componentProperties: FigmaComponentProperties): string | null {
  const tagName = config.prefix ? `${config.prefix}-${componentName}` : componentName;
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
  attributes = attributes.replace('$prefix', config.prefix)

  return `<${tagName}${attributes}></${tagName}>`;
};

function handleGenerateCodeSpacingFromFigma(figmaFrame: FrameNode): string | null {
  const itemSpacing = figmaFrame.itemSpacing ?? 0;

  let cssClassName = config.prefix ? `${config.prefix}-spacing` : `spacing`;
  cssClassName+= `-${itemSpacing}`  

  return `<span class="${cssClassName}"></span>`;
}

export const handleGenerateCodeSession = (conf: Config, selection: SceneNode): CodegenResult[] => {
  const codegenResult: Array<CodegenResult> = []
  config = conf

  if (selection.type !== 'INSTANCE' && selection.type !== 'FRAME') {
    return []
  }

  if (selection.type === 'INSTANCE') {

    const code = handleGenerateCodeComponent(selection.name, selection.variantProperties ?? {})
    code && codegenResult.push({
      language: 'HTML',
      code,
      title: 'Component Exemple'
    })
  }
 
  if (selection.type === 'FRAME') {
    const code = handleGenerateCodeSpacingFromFigma(selection)
    code && codegenResult.push({
      language: 'HTML',
      code,
      title: 'Component Exemple'
    })
  }
  
  return codegenResult;
}
