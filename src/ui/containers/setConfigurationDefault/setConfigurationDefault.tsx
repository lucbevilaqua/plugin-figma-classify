import React, { useEffect, useMemo, useState } from "react";
import { Text, Button, Title } from "react-figma-plugin-ds";

import './styles.css'
import { SetConfigurationDefaultProps } from "./types";
import Form from "@components/form/form";
import { Config, CustomConfig } from "@typings/config";
import Input from "@components/input/input";
import { PluginMessage } from "@typings/pluginMessages";
import Alert from "@components/alert/alert";

const valueDefault: CustomConfig = {
  key: '12345',
  name: 'exemple',
  properties: {
    size: { type: 'property', mask: '$propertyName="$value"' },
    direction: { type: 'directive', mask: 'is$value' },
    bold: { type: 'cssClass', mask: '$propertyName' },
  }
}

const SetConfigurationDefaultProps = ({ }: SetConfigurationDefaultProps) => {
  const [prefix, setPrefix] = useState<string>('')
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [formDefault, setFormDefault] = useState<CustomConfig>(valueDefault)

  useEffect(() => {
    function handleComponentData(event: MessageEvent) {
      const msg = event.data.pluginMessage as PluginMessage;

      if (msg.action === 'getConfig' && msg.payload.general) {
        const data: Config = msg.payload;
        setPrefix(data.prefix)

        setFormDefault(prev => ({
          ...prev,
          prefix: data.prefix,
          properties: {
            size: { type: 'property', mask: data.general.property },
            direction: { type: 'directive', mask: data.general.directive },
            bold: { type: 'cssClass', mask: data.general.cssClass },
          }
        }))
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

  const handlePrefixChange = (prefix: string) => {
    setPrefix(prefix);
  };

  const handleSubmit = () => {
    const config: Config = {
      prefix,
      general: {
        'property': formDefault.properties.size.mask,
        'directive': formDefault.properties.direction.mask,
        'cssClass': formDefault.properties.bold.mask
      }
    }
    parent.postMessage({ pluginMessage: { action: 'saveConfigDefault', payload: config } }, '*');
    setShowAlert(true)
  }

  const AlertMemo = useMemo(() => {
    return (
      <Alert show={showAlert} changeDisplay={setShowAlert} message="Dados salvos com sucesso!" />
    )
  }, [showAlert])

  return (
    <>
      {AlertMemo}
      <header className='header'>
        <Title size='xlarge' weight='bold'>Let's start configuring !</Title>
      </header>
      <div className='content'>
        <Text>Below are all the properties created for this component, let's map them to generate the most appropriate code. If necessary, call a member of your engineering team.</Text>
        <Text>Enter your application prefix below.</Text>
        <div className="is-flex gap-16 align-center">
          <Text weight="bold">Prefix:</Text>
          <Input
            placeholder="Input prefix of your application"
            value={prefix}
            input={handlePrefixChange} />
        </div>
        <Form
          component={formDefault.properties}
          onPropertiesChange={handleFormChange}
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

export default SetConfigurationDefaultProps;
