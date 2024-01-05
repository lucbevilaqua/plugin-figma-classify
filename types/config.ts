
export interface Config {
  general: GeneralConfig
  custom?: Record<string, CustomConfig>
}

export interface CustomConfig  {
  key: string
  name: string
  properties: ComponentProperties
}

export type ComponentProperties = Record<string, { type: ComponentPropertiesCodeType, mask: string}> 

export type GeneralConfig  = Record<ComponentPropertiesCodeType, string>

export type ComponentPropertiesCodeType = 'property' | 'cssClass' | 'directive'
