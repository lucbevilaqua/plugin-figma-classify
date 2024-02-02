export type PluginCommands = 'startOnboarding' | 
  'saveConfig' |
  'getAllComponents' |
  'currentComponent' |
  'setComponentFocus'

export interface PluginMessage {
  action: PluginCommands
  payload?: any
}
