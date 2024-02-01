import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { Select, Text, Button } from "react-figma-plugin-ds";

import './styles.css'
import { FormProps, SelectOption, Form } from "./types";
import useDebounce from "@src/ui/hooks/useDebounce";
import Input from "@components/input/input";
import HelpBubble from "@components/help-bubble/help-bubble";
import { PluginMessage } from "@typings/pluginMessages";
import { ComponentProperties } from "@typings/config";
import Modal from "@components/modal/modal";
import MonacoEditor from "react-monaco-editor";

const HelpBubbleContent = memo(() => (
  <div>
    <Text>You can use our variables listed below in your mask.</Text>
    <ul>
      <li><Text size='small'><i>$propertyName</i>: It returns the name of the property that the instance contains.</Text></li>
      <li><Text size='small'><i>$value</i>: It returns the value of the property that the instance contains.</Text></li>
      <li><Text size='small'><i>$prefix</i>: It returns the value of the previously informed prefix.</Text></li>
    </ul>
  </div>
));

const Form = ({ component, onPropertiesChange, hasDisabledPropType = false }: FormProps) => {
  const properties = useRef<ComponentProperties>(component.properties);
  const [showModal, setShowModal] = useState(false);
  const [codeExemple, setCodeExemplo] = useState<string>('')
  const [currentPropertySelected, setCurrentPropertySelected] = useState<any>({})
  const [inputCode, setInputCode] = useState('');
  const [form, setForm] = useState<Form>(() => {
    const obj: any = {}
    for (const key in properties.current) {
      if (Object.prototype.hasOwnProperty.call(properties.current, key)) {
        const values = properties.current[key];
        obj[key] = { ...values, disabled: false }
      }
    }

    return obj;
  })
  const debouncedInputValue = useDebounce(inputCode, 500);
  const debouncedFormValue = useDebounce(form, 500);
  const options: Array<SelectOption> = [
    { value: 'property', label: 'Property', mask: '$propertyName="$value"' },
    { value: 'directive', label: 'Directive', mask: 'is$value' },
    { value: 'cssClass', label: 'Css Class', mask: '$propertyName' },
    { value: 'code', label: 'Code', code: '' }
  ]

  useEffect(() => {
    function handleComponentData(event: MessageEvent) {
      const msg = event.data.pluginMessage as PluginMessage;

      if (msg.action === 'getGenerateCodeExemple') {
        const code: string = msg.payload.code;

        setCodeExemplo(code);
      }
    }

    window.addEventListener('message', handleComponentData);


    return () => window.removeEventListener('message', handleComponentData);
  }, []);

  useEffect(() => {
    if (inputCode && (inputCode !== currentPropertySelected.code)) {
      handleChangeCode();
    }
  }, [debouncedInputValue]);

  useEffect(() => {
    parent.postMessage({ pluginMessage: { action: 'generateCodeExemple', payload: { name: component.name, form } } }, '*');
    onPropertiesChange(form)
  }, [debouncedFormValue]);

  const handleChangeType = (property: any, propertyName: string, option: SelectOption) => {
    const value = option.value as string;
    if (value === 'code') {
      delete property.mask;
    } else {
      property.mask = option.mask;
      delete property.code;
    }

    setForm((prev) => ({
      ...prev,
      [propertyName]: { ...property, type: value, disabled: value === 'cssClass' }
    } as Form))
  }

  const handleChangeValue = (propertyName: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [propertyName]: { ...prev[propertyName], mask: value }
    }))
  }

  const handleChangeCode = () => {
    const propertyName = currentPropertySelected.propertyName;

    setForm((prev) => ({
      ...prev,
      [propertyName]: { ...prev[propertyName], code: inputCode }
    }))
  }

  const handleShowModal = (property: any) => {
    setShowModal(prev => !prev)
    setCurrentPropertySelected(property)
    setInputCode(property.code);
  }

  const handleCloseModal = () => {
    setShowModal(prev => !prev);
  }

  const row = useMemo(() => {
    return Object.keys(form).map(propertyName => {
      const mask = form[propertyName].mask
      const property = form[propertyName]
      return (
        <div key={propertyName} className='form-container'>
          <Text>{propertyName}</Text>
          <Select placeholder='Select type of the property' isDisabled={hasDisabledPropType} options={options} defaultValue={property.type} onChange={(option) => handleChangeType(property, propertyName, option as SelectOption)}></Select>

          {
            property.type === 'code' ?
              <Button
                onClick={() => handleShowModal({ propertyName, ...property })}
              >
                Editar
              </Button> :
              <Input
                placeholder="Input mask for build the value"
                type="text"
                value={mask}
                disabled={form[propertyName].disabled}
                input={(value) => handleChangeValue(propertyName, value)} />
          }
        </div>
      )
    })
  }, [form])

  return (
    <>
      <div>
        <div className='form-header'>
          <Text weight='bold'>Property</Text>
          <Text weight='bold'>Type of Property</Text>
          <div className="is-flex">
            <Text weight='bold'>
              Mask of the value
            </Text>
            <HelpBubble>
              <HelpBubbleContent />
            </HelpBubble>
          </div>
        </div>

        <Modal title='Editar codigo de exemplo' show={showModal} onClosed={handleCloseModal}>
          <Text>You can put example code for this property that will be displayed in a separate code section from the rest</Text>

          <MonacoEditor
            language="html"
            theme="vs-dark"
            value={inputCode}
            onChange={(value) => setInputCode(value)}
            options={{ minimap: { enabled: false }, lineNumbers: 'off' }}
          />
        </Modal>

        {row}
      </div>
      <hr />
      <Text>Exemple Output.</Text>
      <Text>{codeExemple}</Text>
    </>
  );
};

export default Form;
