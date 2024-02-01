import React, { useEffect, useState } from 'react';

import { Button, Select, SelectOption, Text } from "react-figma-plugin-ds";
import Form from '@components/form/form';

import './styles.css'
import { PluginMessage } from '@typings/pluginMessages';
import { SetCustomConfigurationProps } from './types';
import { CustomConfig } from '@typings/config';

const CustomConfiguration = ({ }: SetCustomConfigurationProps) => {
  const [componentList, setComponentList] = useState<Array<any>>([]);
  const [component, setComponent] = useState<CustomConfig>({} as CustomConfig);

  useEffect(() => {
    function handleComponentData(event: MessageEvent) {
      const msg = event.data.pluginMessage as PluginMessage;
      if (msg.action === 'getAllComponents') {
        setComponentList(msg.payload)
      }
    }

    window.addEventListener('message', handleComponentData);

    parent.postMessage({ pluginMessage: { action: 'getAllComponents' } }, '*');
    return () => window.removeEventListener('message', handleComponentData);
  }, []);

  const handleSave = () => {
    parent.postMessage({ pluginMessage: { action: 'saveConfig', payload: component } }, '*');
  }

  const handleComponentChange = (option: SelectOption) => {
    setComponent(componentList.find((component) => component.key === option.value))
    parent.postMessage({ pluginMessage: { action: 'setComponentFocus', payload: component.key } }, '*');
  }

  const handleFormChange = (form: Form) => {
    setComponent(prevMappings => ({
      ...prevMappings,
      properties: form
    }));
  };

  return (
    <>
      {component && (
        <>
          <header className='header'>
            <Text size='xlarge' weight='bold'>Component</Text>
            <Select
              placeholder='Select component'
              options={componentList.map((component) => ({ value: component.key, label: component.name }))}
              onChange={handleComponentChange}
            />
          </header>
          <div className='content'>
            {component.properties &&
              <>
                <Text>Below are all the properties created for this component, let's map them to generate the most appropriate code. If necessary, call a member of your engineering team.</Text>
                <Form
                  component={component}
                  onPropertiesChange={handleFormChange}
                />
              </>
            }
          </div>

          <footer className='is-flex align-center justify-end gap-16'>
            <Button
              onClick={handleSave}
            >
              Salvar
            </Button>
          </footer>
        </>
      )}
    </>
  );
};

export default CustomConfiguration;
