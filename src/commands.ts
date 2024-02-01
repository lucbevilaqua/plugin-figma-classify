import { startPluginWithParameters } from "./parameters";
import { getPluginCollection } from "./utils";

const collection: VariableCollection = getPluginCollection();

function resetAllConfig() {
  collection.setPluginData('prefix', '')
  collection.setPluginData('config', JSON.stringify({}))
  figma.notify('Config reseted.')
}

figma.on("run", ({ command,  parameters }: RunEvent) => {
  if (command === 'configureCodegen' && parameters) {
    startPluginWithParameters(parameters);
  } else if (command === 'resetAllConfigurations') {
    resetAllConfig();
  }
});
