import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, Button, Title, Checkbox } from "react-figma-plugin-ds";

import './styles.css'
import { SelectCustomComponentsProps } from "./types";
import { PluginMessage } from "@typings/pluginMessages";
import { CustomConfig } from "@typings/config";

const SelectCustomComponents = ({ nextStep }: SelectCustomComponentsProps) => {
  const [components, setComponents] = useState<Array<CustomConfig>>([]);
  const [componentsSelected, setComponentsSelected] = useState<Array<CustomConfig>>([]);

  useEffect(() => {
    function handleComponentData(event: MessageEvent) {
      const msg = event.data.pluginMessage as PluginMessage;

      if (msg.action === 'getAllComponents') {
        const data = msg.payload;
        setComponents(data);
        setComponentsSelected(data);
      }
    }

    window.addEventListener('message', handleComponentData);

    getAllComponents()

    return () => window.removeEventListener('message', handleComponentData);
  }, []);


  const getAllComponents = () => {
    parent.postMessage({ pluginMessage: { action: 'getAllComponents' } }, '*');
  }

  const handleChangeComponentsSelected = (value: boolean, component: CustomConfig) => {
    if (value) {
      setComponentsSelected(prev => [...prev, component])
    } else {
      setComponentsSelected(prev => prev.filter(comp => comp.name !== component.name))
    }
  }

  const handleNext = () => {
    parent.postMessage({ pluginMessage: { action: 'setCustomComponents', payload: componentsSelected } }, '*');
    nextStep()
  }

  return (
    <>
      <header className='header'>
        <Title size='xlarge' weight='bold'>Customized configuration !</Title>
      </header>
      <div className='content'>
        <Text>We found the following components in this file, select which ones you want to customize so we can generate the best code that suits your project.</Text>
        <div>
          {components.map(component => (
            <Checkbox
              key={component.key}
              label={component.name}
              defaultValue={true}
              onChange={(value) => handleChangeComponentsSelected(value, component)}
              type="checkbox"
            />
          ))}
        </div>
      </div>
      <footer className='is-flex align-center justify-end gap-16'>
        <Button
          onClick={handleNext}
        >
          Próximo
        </Button>
      </footer>
    </>
  );
};

export default SelectCustomComponents;
