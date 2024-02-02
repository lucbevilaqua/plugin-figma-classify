export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getPluginCollection() {
  const localCollections = figma.variables.getLocalVariableCollections();
  let collection: VariableCollection = localCollections.find(lc => lc.name === 'codegen-mapper')!;
  
  if(!collection) {
    collection = figma.variables.createVariableCollection('codegen-mapper');
  }
  
  return collection;
}

export const showUIOptionsDefault: ShowUIOptions = { 
  themeColors: true,
  height: 600,
  width: 650,
}
