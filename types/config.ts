
export interface Config {
  general: GeneralConfig
  custom?: Record<string, CustomConfig>
}

export interface CustomConfig  {
  key: string
  name: string
  hasComponentNameTag: boolean
  properties: ComponentProperties
}

export type ComponentProperties = Record<string, { type: ComponentPropertiesCodeType, mask?: string, code?: string }> 

export type GeneralConfig  = Record<Exclude<ComponentPropertiesCodeType, 'code'>, string>

export type ComponentPropertiesCodeType = 'property' | 'cssClass' | 'directive' | 'code'
