export type PluginCommands = 'startOnboarding' | 
  'saveConfig' |
  'saveConfigDefault' |
  'getAllComponents' |
  'currentComponent' |
  'setComponentFocus' |
  'getConfig' |
  'generateCodeExemple' |
  'getGenerateCodeExemple'

export interface PluginMessage {
  action: PluginCommands
  payload?: any
}
