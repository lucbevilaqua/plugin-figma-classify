import { handleSelectionChange } from './generate';
import { getPluginCollection, showUIOptionsDefault } from './utils'

const collection: VariableCollection = getPluginCollection();

// Listeners
figma.parameters.on(
  'input',
  ({ parameters, key, query, result }: ParameterInputEvent) => {
    switch (key) {
      case 'prefix':
        const prefixDefault = collection.getPluginData('prefix')
        if(prefixDefault) {
          result.setSuggestions([prefixDefault])
        }
        break
      default:
        return
    }
  }
)


// Handlers
export function startPluginWithParameters(parameters: ParameterValues) {
  const prefix = parameters['prefix']

  collection.setPluginData('prefix', prefix);
  
  if (figma.editorType !== 'dev') {
    figma.showUI(__html__, showUIOptionsDefault);
    handleSelectionChange()
  }
}
