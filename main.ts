type GeneratorCodeProps = {
  prefix: string;
  componentProps: { [key: string]: string | boolean };
  componentName: string;
};

type MappingToProps = { [key: string]: (key: string, value: string | boolean) => string }
type MappingSpacings = { [key: string]: string }

// Listerners
figma.codegen.on("generate", () => handleGenerateCodeSession());

//Handlers

const handleGenerateCodeSession = (): CodegenResult[] => {
  const codeHtmlTag = buildHtmlTag()
  const codeCssClassName = buildCssClassName()
  const codeSpacing = buildFrameClassName()
  const codegenResult: Array<CodegenResult> = []
  
  codeHtmlTag && codegenResult.push({
    language: "HTML",
    code: buildHtmlTag()!,
    title: "Tag HTML",
  })
  codeCssClassName && codegenResult.push({
    language: "HTML",
    code: buildCssClassName()!,
    title: "Class CSS Name",
  })
  codeSpacing && codegenResult.push({
    language: "HTML",
    code: buildFrameClassName()!,
    title: "Spacing Class Name",
  })
  
  return codegenResult;
}


const setPropInClassName: MappingToProps = {
  'string': (key, value) => ` -${value}`,
  'boolean': (key, value) => ` -${key}`,
};

const setPropInHtmlTag: MappingToProps = {
  'string': (key, value) => ` ${key}="${value}"`,
  'boolean': (key, value) => ` ${value}`,
};

const mappingSpacing: MappingSpacings = {
  '0': 'p-0',
  '8': 'p-2',
  '16': 'p-4',
  '24': 'p-6',
  '32': 'p-8',
  '40': 'p-10',
  '48': 'p-12',
  '56': 'p-14',
};

const buildCssClassName = (): string | null => {
  const { prefix, componentProps, componentName } = getComponentProperties() ?? {}
  let cssClassName = prefix ? `${prefix}-${componentName}` : `${componentName}`;

  
  if (!componentProps && !componentName) {
    return null
  }
  
  for (const key in componentProps) {
    const propType = typeof componentProps[key];
    const value = componentProps[key]
    if (setPropInClassName[propType]) {
      cssClassName += setPropInClassName[propType](key, value);
    }
  }

  return cssClassName;
}

const buildFrameClassName = (): string | null => {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0 || selection[0].type !== 'FRAME') {
    return null;
  }
  const prefix = 'ids'
  const instance = selection[0];
  const itemSpacing = instance.itemSpacing ?? 0;
  const frameName = instance.name;

  let cssClassName = prefix ? `${prefix}-spacing` : `spacing`;
  cssClassName+= `-${mappingSpacing[itemSpacing]}`  

  return cssClassName;
}

const buildHtmlTag = (): string | null => {
  const { prefix, componentProps, componentName } = getComponentProperties() ?? {}
  const tagName = prefix ? `${prefix}-${componentName}` : componentName;
  let attributes = '';

  if (!componentProps && !componentName) {
    return null
  }

  for (const key in componentProps) {
    const propType = typeof componentProps[key];
    const value = componentProps[key]
    if (setPropInClassName[propType]) {
      attributes += setPropInHtmlTag[propType](key, value);
    }
  }

  return `<${tagName}${attributes}></${tagName}>`;
};

const getComponentProperties = (): GeneratorCodeProps | null => {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0 || selection[0].type !== 'INSTANCE') {
    return null;
  }
  const instance = selection[0];
  const componentProps = instance.variantProperties ?? {};
  const componentName = instance.name;

  return { prefix: 'ids', componentProps, componentName}
}

