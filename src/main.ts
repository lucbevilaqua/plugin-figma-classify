import { getPluginCollection, showUIOptionsDefault } from './utils';
import './parameters';
import './commands';
import './server';
import './generate';
import { Config } from '@typings/config';

export const collection: VariableCollection = getPluginCollection();

export const getConfig = (): Config => JSON.parse(collection.getPluginData('config') || JSON.stringify({ custom: {} }));

// initiate UI
if (figma.editorType !== 'dev') {
  figma.showUI(__html__, {...showUIOptionsDefault, visible: false})
}
