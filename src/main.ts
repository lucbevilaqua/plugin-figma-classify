import { showUIOptionsDefault } from './utils';
import './parameters';
import './server';
import './generate';

// initiate UI
if (figma.editorType !== 'dev') {
  figma.showUI(__html__, {...showUIOptionsDefault, visible: false})
}
