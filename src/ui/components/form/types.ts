import { ComponentPropertiesCodeType, ComponentProperties } from "@typings/config";
import { SelectOption as FSP } from "react-figma-plugin-ds";

export interface FormProps {
  component: ComponentProperties
  onPropertiesChange: (form: Form) => void
}

export interface Form {
  [key: string]: { type: ComponentPropertiesCodeType, mask: string, disabled: boolean};
}

export interface SelectOption extends FSP {
  value: ComponentPropertiesCodeType
  mask: string
}
