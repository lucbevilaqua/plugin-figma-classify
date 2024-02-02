import { ComponentProperties, CustomConfig } from "@typings/config";

export interface ComponentPropertyMapperProps {
  component: CustomConfig
  onPropertiesChange: (properties: ComponentProperties) => void
}
