import React, { useEffect, useState } from 'react';

import { Button, Text } from "react-figma-plugin-ds";
import Form from '@components/form/form';

import './styles.css'
import { CustomConfig } from '@typings/config';
import { PluginMessage } from '@typings/pluginMessages';
import { SetCustomConfigurationProps } from './types';

const CustomConfiguration = ({ }: SetCustomConfigurationProps) => {
  const [component, setComponent] = useState<CustomConfig>({} as CustomConfig);

  useEffect(() => {
    function handleComponentData(event: MessageEvent) {
      const msg = event.data.pluginMessage as PluginMessage;
      if (msg.action === 'currentComponent') {
        const componentData = msg.payload;

        if (componentData) {
          const properties: any = {}
          for (const key in componentData.properties) {
            if (Object.prototype.hasOwnProperty.call(componentData.properties, key)) {
              properties[key] = { type: 'property', mask: '$propertyName="$value"' }
            }
          }
          setComponent({
            key: componentData.key,
            name: componentData.name,
            properties
          });
        }
      }
    }

    window.addEventListener('message', handleComponentData);

    return () => window.removeEventListener('message', handleComponentData);
  }, []);

  const handleNextButtonClick = () => {
    parent.postMessage({ pluginMessage: { action: 'saveConfig', payload: component } }, '*');
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
            <Text size='xlarge' weight='bold'>Component {component.name ?? ''}</Text>
          </header>
          <div className='content'>
            <Text>Below are all the properties created for this component, let's map them to generate the most appropriate code. If necessary, call a member of your engineering team.</Text>
            {component.properties && <Form
              component={component.properties}
              onPropertiesChange={handleFormChange}
            />}
          </div>

          <footer className='is-flex align-center justify-end gap-16'>

            <Button
              onClick={handleNextButtonClick}
            >
              Próximo
            </Button>
          </footer>
        </>
      )}
    </>
  );
};

export default CustomConfiguration;
