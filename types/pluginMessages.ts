export type PluginCommands = 'startOnboarding' | 
  'saveConfig' |
  'getAllComponents' |
  'currentComponent' |
  'selectionChange' |
  'setComponentFocus'

export interface PluginMessage<T = any> {
  action: PluginCommands
  payload?: T
}
