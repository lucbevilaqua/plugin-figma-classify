import { getPluginCollection, showUIOptionsDefault } from './utils'

const collection: VariableCollection = getPluginCollection();

// Listeners
figma.parameters.on(
  'input',
  ({ parameters, key, query, result }: ParameterInputEvent) => {
    switch (key) {
      case 'prefix':
        if(collection) {
          const prefixDefault = collection.getPluginData('prefix')
          result.setSuggestions([prefixDefault])
        }
        break
      default:
        return
    }
  }
)

// When the user presses Enter after inputting all parameters, the 'run' event is fired.
figma.on("run", ({ parameters }: RunEvent) => {
  if (parameters) {
    startPluginWithParameters(parameters);
  }
});

// Handlers
function startPluginWithParameters(parameters: ParameterValues) {
  const prefix = parameters['prefix']
  const configDefault = {
    prefix,
    general: {
      cssClass: '$propertyName',
      directive: 'is$value',
      property: '$propertyName="$value"'
    }
  }
  collection.setPluginData('prefix', parameters['prefix']);
  
  if(!collection.getPluginData('config')) {
    collection.setPluginData('config', JSON.stringify(configDefault));
  }
  
  if (figma.editorType !== 'dev') {
    figma.showUI(__html__, showUIOptionsDefault)
  }
}
