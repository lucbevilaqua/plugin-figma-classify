import React, { useEffect, useState } from "react";

import './styles.css'
import { ComponentPropertyMapperProps } from "./types";
import useDebounce from "@src/ui/hooks/useDebounce";
import { ComponentProperties, CustomConfig } from "@typings/config";
import TableComponent from "./table/table";
import { PropertyType } from "./table/types";
import { toCamelCase } from "@/utils";
import CodeBlock from "@/ui/components/ui/codeblock";


const getGenerateCodeComponentExemple = (component: CustomConfig): string => {
  const prefix: string = 'exemple'
  const componentName = toCamelCase(component.name);
  const properties = component.properties;

  const tagName = prefix ? `${prefix}-${componentName}` : componentName;
  let attributes = '';
  let classCss = '';

  for (const key in properties) {
    if (Object.prototype.hasOwnProperty.call(properties, key)) {
      const element = properties[key];
      const value = element.values[0]?.value
      const code = element.values[0]?.code

      if (element.type === 'cssClass') {
        classCss += ` ${code}`;
        classCss = classCss.replace('$propertyName', key)
        classCss = classCss.replace('$value', value)
      } else {
        attributes += ` ${code}`;
        attributes = attributes.replace('$propertyName', key)
        attributes = attributes.replace('$value', value)
      }
    }
  }

  attributes = attributes.replace('$prefix', prefix)
  classCss = classCss.replace('$prefix', prefix)
  const codeExemple = `<${tagName} ${classCss && `class="${classCss.trimStart()}"`}${attributes}></${tagName}>`;
  return codeExemple;
}

const ComponentPropertyMapper = ({ component, onPropertiesChange }: ComponentPropertyMapperProps) => {
  const [codeExemple, setCodeExemplo] = useState<string>(getGenerateCodeComponentExemple(component))
  const [properties, setProperties] = useState<ComponentProperties>(() => component.properties)
  const debouncedPropertiesValue = useDebounce(properties, 500);

  useEffect(() => {
    setProperties(component.properties)
  }, [component]);

  useEffect(() => {
    onPropertiesChange(properties)
  }, [debouncedPropertiesValue]);

  useEffect(() => {
    setCodeExemplo(getGenerateCodeComponentExemple(component))
  }, [component]);

  const handleTypeChange = (propertyName: string, option: PropertyType) => {
    const value = option.value;
    const prevComponentProperty = properties[propertyName];
    const values = prevComponentProperty.values.map(val => ({ ...val, code: option.code! }));

    setProperties((prev) => ({
      ...prev,
      [propertyName]: { ...prevComponentProperty, values, type: value }
    }))
  }

  const handleChangeValue = (value: string, propertyName: string, index: number) => {
    const values = properties[propertyName].values;
    values[index] = { ...values[index], code: value };
    setProperties((prev) => ({
      ...prev,
      [propertyName]: { ...prev[propertyName], values }
    }))
  }

  return (
    <>
      <p className="leading-7 [&:not(:first-child)]:my-6">Exemple Output.</p>
      <CodeBlock value={codeExemple} />

      <div>
        <TableComponent
          component={component}
          onTypeChange={handleTypeChange}
          onInputValue={handleChangeValue}
        />
      </div>
    </>
  );
};

export default ComponentPropertyMapper;
