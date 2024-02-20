import React, { useEffect, useState } from 'react';

import './styles.css'
import { PluginMessage } from '@typings/pluginMessages';
import { SetCustomConfigurationProps } from './types';
import { CustomConfig, ComponentProperties } from '@typings/config';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { RotateCcw, SaveAllIcon } from 'lucide-react';
import ComponentPropertyMapper from '../../containers/componentPropertyMapper/componentPropertyMapper';
import { Input } from '@/ui/components/ui/input';
import { Label } from '@/ui/components/ui/label';
import ComponentCombobox from './componentCombobox/componentCombobox';

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

  const handleReset = () => {
    const componentName = component.name;
    setComponent({} as CustomConfig);
    parent.postMessage({ pluginMessage: { action: 'deleteComponentConfig', payload: component } }, '*');
    setTimeout(() => setComponent(componentList.find((component) => component.name === componentName)));
  }

  const handleComponentChange = (optionValue: string) => {
    setComponent(componentList.find((component) => component.name.toLowerCase() === optionValue.toLowerCase()))
    parent.postMessage({ pluginMessage: { action: 'setComponentFocus', payload: component.key } }, '*');
  }

  const handlePropertiesChange = (properties: ComponentProperties) => {
    setComponent(prevMappings => ({
      ...prevMappings,
      properties
    }));
  };

  const handleComponentTageChange = (value: string) => {
    setComponent(prevMappings => ({
      ...prevMappings,
      tag: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Let's start configuring !
          <ComponentCombobox
            list={componentList}
            value={component.name}
            onChange={handleComponentChange}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {component.properties &&
          <>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Below are all the properties created for this component, let's map them to generate the most appropriate code. If necessary, call a member of your engineering team.
            </p>
            <div className='flex gap-4'>
              <Label htmlFor="componentTag" className='min-w-32 flex items-center'>Component Tag</Label>
              <Input
                id='componentTag'
                defaultValue={component.tag ?? component.name}
                onInput={(event) => handleComponentTageChange(event.currentTarget.value)}
                className="h-8"
              />
            </div>
            <ComponentPropertyMapper
              component={component}
              onPropertiesChange={handlePropertiesChange}
            />
          </>
        }
      </CardContent>
      <CardFooter className='flex gap-2'>
        <Button
          onClick={handleSave}
          disabled={!component.name}
        >
          <SaveAllIcon size={24} className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button
          onClick={handleReset}
          variant='destructive'
          disabled={!component.name}
        >
          <RotateCcw size={24} className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CustomConfiguration;
