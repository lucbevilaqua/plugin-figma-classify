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

export function toCamelCase(str: string) {
  return str
      // Substitui espaços, sublinhados ou hifens por espaços
      .replace(/[\s_\-]+/g, ' ')
      // Substitui o primeiro caractere de cada palavra, exceto a primeira, por maiúsculas
      .replace(/\w\S*/g, function(txt, index) {
          return index === 0 ? txt.toLowerCase() : txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      })
      // Remove espaços
      .replace(/\s+/g, '');
}

export const showUIOptionsDefault: ShowUIOptions = { 
  themeColors: true,
  height: 600,
  width: 650,
}
