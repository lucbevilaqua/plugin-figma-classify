export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getPluginCollection() {
  const localCollections = figma.variables.getLocalVariableCollections();
  let collection: VariableCollection = localCollections.find(lc => lc.name === 'figma-classify')!;
  
  if(!collection) {
    collection = figma.variables.createVariableCollection('figma-classify');
  }
  
  return collection;
}

export const showUIOptionsDefault: ShowUIOptions = { 
  themeColors: true,
  height: 500,
  width: 550,
}
