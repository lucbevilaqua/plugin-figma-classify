import { ComponentPropertiesCodeType, CustomConfig } from "@typings/config";
import { SelectOption as FSP } from "react-figma-plugin-ds";

export interface FormProps {
  component: CustomConfig
  onPropertiesChange: (form: Form) => void
  hasDisabledPropType?: boolean
}

export interface Form {
  [key: string]: { type: ComponentPropertiesCodeType, mask: string, disabled: boolean};
}

export interface SelectOption extends FSP {
  value: ComponentPropertiesCodeType
  mask?: string
  code?: string
}
