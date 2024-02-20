export type PluginCommands = 'startOnboarding' | 
  'saveConfig' |
  'getAllComponents' |
  'currentComponent' |
  'selectionChange' |
  'setComponentFocus'

export interface PluginMessage {
  action: PluginCommands
  payload?: any
}
