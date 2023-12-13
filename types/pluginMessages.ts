export type PluginCommands = 'startOnboarding' | 'saveConfig' | 'saveConfigDefault' | 'getAllComponents' | 'currentComponent' | 'setCustomComponents' | 'getConfig'

export interface PluginMessage {
  action: PluginCommands
  payload?: any
}
