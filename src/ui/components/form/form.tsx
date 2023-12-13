import React, { useEffect, useMemo, useState } from "react";
import { Select, Text, Icon } from "react-figma-plugin-ds";

import './styles.css'
import { FormProps, SelectOption, Form } from "./types";
import useDebounce from "@src/ui/hooks/useDebounce";
import Input from "@components/input/input";

const Form = ({ component, onPropertiesChange }: FormProps) => {
  const [form, setForm] = useState<Form>(() => {
    const obj: any = {}
    for (const key in component) {
      if (Object.prototype.hasOwnProperty.call(component, key)) {
        const values = component[key];
        obj[key] = { ...values, disabled: false }
      }
    }

    return obj;
  })
  const debouncedInputValue = useDebounce(form, 500);

  useEffect(() => {
    onPropertiesChange(form)
  }, [debouncedInputValue]);

  const options: Array<SelectOption> = [
    { value: 'property', label: 'Property', mask: '$propertyName="$value"' },
    { value: 'directive', label: 'Directive', mask: 'is$value' },
    { value: 'cssClass', label: 'Css Class', mask: '$propertyName' }
  ]

  const handleChangeType = (propertyName: string, option: SelectOption) => {
    const value = option.value as string;
    setForm((prev) => ({
      ...prev,
      [propertyName]: { type: value, mask: option.mask, disabled: value === 'cssClass' }
    } as Form))
  }

  const handleChangeValue = (propertyName: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [propertyName]: { ...prev[propertyName], mask: value }
    }))
  }

  const row = useMemo(() => {
    return Object.keys(form).map(propertyName => {
      const mask = form[propertyName].mask
      return (
        <div key={propertyName} className='form-container'>
          <Text>{propertyName}</Text>
          <Select placeholder='Select type of the property' options={options} defaultValue={form[propertyName].type} onChange={(option) => handleChangeType(propertyName, option as SelectOption)}></Select>
          <Input
            placeholder="Input mask for build the value"
            value={mask}
            disabled={form[propertyName].disabled}
            input={(value) => handleChangeValue(propertyName, value)} />
        </div>
      )
    })
  }, [form])

  return (
    <>
      <div className="tip-container">
        <Icon
          color="blue"
          name="library"
        />
        <div>
          <Text>You can use our variables listed below in your mask.</Text>
          <ul>
            <li><Text size='small'><i>$propertyName</i>: It returns the name of the property that the instance contains.</Text></li>
            <li><Text size='small'><i>$value</i>: It returns the value of the property that the instance contains.</Text></li>
            <li><Text size='small'><i>$prefix</i>: It returns the value of the previously informed prefix.</Text></li>
          </ul>
        </div>
      </div>
      <div className='form-header'>
        <Text weight='bold'>Property</Text>
        <Text weight='bold'>Type of Property</Text>
        <Text weight='bold'>Mask of the value</Text>
      </div>

      {row}
    </>
  );
};

export default Form;
