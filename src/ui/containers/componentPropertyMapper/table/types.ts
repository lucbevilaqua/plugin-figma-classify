import { ComponentPropertiesCodeType, CustomConfig } from "@typings/config"

export interface TableProps {
  component: CustomConfig,
  onTypeChange: (propertyName: string, optionSelected: PropertyType) => void,
  onInputValue: (value: string, propertyName: string, index: number) => void 
}

export interface PropertyType {
  value: ComponentPropertiesCodeType,
  label: string,
  code: string
}
