
export interface Config {
  custom?: Record<string, CustomConfig>
}

export interface CustomConfig  {
  key: string
  name: string
  hasComponentNameTag: boolean
  properties: ComponentProperties
}

export interface ComponentProperty {
  type: ComponentPropertiesCodeType,
  values: Array<{ value: string, code: string}>
}

export type ComponentProperties = Record<string, ComponentProperty> 

export type ComponentPropertiesCodeType = 'property' | 'cssClass' | 'directive'
