import designSystem from '../../design-system'
import { DsComponentType, FigmaComponentProps, MappingGenerators } from '../types';

const prefix = designSystem.prefix ?? 'ds'

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function handleGenerateCodeComponent(componentName: string, componentProperties: FigmaComponentProps): string | null {
  const dsComponent = designSystem.components[componentName]
  const tagName = prefix ? `${prefix}-${componentName}` : componentName;
  const dsComponentProps = dsComponent.props
  const dsComponentDirectives = dsComponent.directives
  let attributes = '';

  dsComponentProps.forEach(prop => {
    const value = componentProperties[prop]
    attributes += ` ${prop}="${value}"`;
  });

  dsComponentDirectives.forEach(directive => {
    const mask = directive.mask
    const value = dsComponent.options?.capitalize ? capitalizeFirstLetter(componentProperties[directive.key] as string) : componentProperties[directive.key];
    if (value) {
      let result = mask.replace('$value', value.toString())
      result = result.replace('$prefix', prefix)
     
      attributes += ` ${result}`;
    }
  });

  return `<${tagName}${attributes}></${tagName}>`;
}

function handleGenerateCodeClassName(componentName: string, componentProperties: FigmaComponentProps): string | null {
  const dsComponent = designSystem.components[componentName]
  const className = prefix ? `${prefix}-${componentName}` : componentName;
  const dsComponentProps = dsComponent.props
  const dsComponentDirectives = dsComponent.directives
  let attributes = '';

  dsComponentProps.forEach(prop => {
    const value = componentProperties[prop]
    attributes += ` ${prop}="${value}"`;
  });

  dsComponentDirectives.forEach(directive => {
    const mask = directive.mask
    const value = dsComponent.options?.capitalize ? capitalizeFirstLetter(componentProperties[directive.key] as string) : componentProperties[directive.key];
    if (value) {
      let result = mask.replace('$value', value.toString())
      result = result.replace('$prefix', prefix)
     
      attributes += ` ${result}`;
    }
  });

  return `<span class="${className}${attributes}"></span>`;
}

function handleGenerateCodeFromFigma(figmaComponent: InstanceNode): string | null {
  const componentProperties = figmaComponent.variantProperties ?? {};
  const componentName = figmaComponent.name;
  const tagName = prefix ? `${prefix}-${componentName}` : componentName;
  let attributes = '';

  if (!componentProperties && !componentName) {
    return null
  }

  for (const key in componentProperties) {
    const value = componentProperties[key]
    attributes += ` ${key}="${value}"`;
  }

  return `<${tagName}${attributes}></${tagName}>`;
};

function handleGenerateCodeSpacingFromFigma(figmaFrame: FrameNode): string | null {
  const itemSpacing = figmaFrame.itemSpacing ?? 0;

  let cssClassName = prefix ? `${prefix}-spacing` : `spacing`;
  cssClassName+= `-${itemSpacing}`  

  return `<span class="${cssClassName}"></span>`;
}

function handleGenerateCodeInstance(figmaComponent: InstanceNode): string | null {
  const componentProperties = figmaComponent.variantProperties ?? {};
  const componentName = figmaComponent.name;

  const dsComponent = designSystem.components[componentName!]

  if (!componentProperties || !componentName || !dsComponent) {
    return null
  }
  const componentType: DsComponentType = dsComponent.type ?? 'component'

  const mappingGenerators: MappingGenerators = {
    'component': handleGenerateCodeComponent,
    'className': handleGenerateCodeClassName,
  }

  return mappingGenerators[componentType](componentName, componentProperties);
};

export const handleGenerateCodeSession = (selection: SceneNode): CodegenResult[] => {
  const codegenResult: Array<CodegenResult> = []
  const hasDsFile = !!Object.keys(designSystem.components).length

  if (selection.type !== 'INSTANCE' && selection.type !== 'FRAME') {
    return []
  }
  
  if (!hasDsFile) {
    if (selection.type === 'INSTANCE') {
      const code = handleGenerateCodeFromFigma(selection)
      code && codegenResult.push({
        language: "HTML",
        code,
        title: "Component Exemple",
      })
    } else {
      const code = handleGenerateCodeSpacingFromFigma(selection)
      code && codegenResult.push({
        language: "HTML",
        code,
        title: "Class CSS Exemple",
      })
    }
  } else {
    if (selection.type === 'INSTANCE') {
      const code = handleGenerateCodeInstance(selection)
      code && codegenResult.push({
        language: "HTML",
        code: code,
        title: "Component Exemple",
      })
    }
  }
  
  return codegenResult;
}
