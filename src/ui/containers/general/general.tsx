import React, { useEffect, useMemo, useState } from "react";
import { Text, Button } from "react-figma-plugin-ds";

import './styles.css'
import { GeneralProps } from "./types";
import Form from "@components/form/form";
import { Config, CustomConfig } from "@typings/config";
import { PluginMessage } from "@typings/pluginMessages";

const valueDefault: CustomConfig = {
  key: '12345',
  name: 'exemple',
  properties: {
    size: { type: 'property', mask: '$propertyName="$value"' },
    direction: { type: 'directive', mask: 'is$value' },
    bold: { type: 'cssClass', mask: '$propertyName' },
  }
}

const General = ({ }: GeneralProps) => {
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [formDefault, setFormDefault] = useState<CustomConfig>(valueDefault)

  useEffect(() => {
    function handleComponentData(event: MessageEvent) {
      const msg = event.data.pluginMessage as PluginMessage;

      if (msg.action === 'getConfig' && msg.payload.general) {
        const data: Config = msg.payload;

        setFormDefault(prev => ({
          ...prev,
          properties: {
            size: { type: 'property', mask: data.general.property },
            direction: { type: 'directive', mask: data.general.directive },
            bold: { type: 'cssClass', mask: data.general.cssClass },
          }
        }))
        parent.postMessage({ pluginMessage: { action: 'generateCodeExemple', payload: { name: 'exemple', form: formDefault } } }, '*');
      }
    }

    window.addEventListener('message', handleComponentData);

    getConfig()

    return () => window.removeEventListener('message', handleComponentData);
  }, []);

  const getConfig = () => {
    parent.postMessage({ pluginMessage: { action: 'getConfig' } }, '*');
  }

  const handleFormChange = (form: Form) => {
    setFormDefault(prevMappings => ({
      ...prevMappings,
      properties: form
    }));
  };


  const handleSubmit = () => {
    const config: Config = {
      general: {
        'property': formDefault.properties.size.mask!,
        'directive': formDefault.properties.direction.mask!,
        'cssClass': formDefault.properties.bold.mask!
      }
    }
    parent.postMessage({ pluginMessage: { action: 'saveConfigDefault', payload: config } }, '*');
  }

  return (
    <>
      <header className='header'>
        <Text size='xlarge' weight='bold'>Let's start configuring !</Text>
      </header>

      <div className='content'>
        <Text>Below are all the properties created for this component, let's map them to generate the most appropriate code. If necessary, call a member of your engineering team.</Text>
        <Form
          component={formDefault}
          onPropertiesChange={handleFormChange}
          hasDisabledPropType
        />
      </div>
      <footer className='is-flex align-center justify-end gap-16'>
        <Button
          onClick={handleSubmit}
        >
          Salvar
        </Button>
      </footer>
    </>
  );
};

export default General;
