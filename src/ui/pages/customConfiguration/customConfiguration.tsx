import React, { useEffect, useState } from 'react';

import './styles.css'
import { PluginMessage } from '@typings/pluginMessages';
import { SetCustomConfigurationProps } from './types';
import { CustomConfig, ComponentProperties } from '@typings/config';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { RotateCcw, SaveAllIcon, ComponentIcon, TagIcon } from 'lucide-react';
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

  const handleComponentTageChange = (data: any) => {
    const value = data.componentTag
    setComponent(prevMappings => ({
      ...prevMappings,
      tag: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Let's start configuring !
        </CardTitle>
        <CardDescription>
          Select a component from the list to begin configuring the code that will be generated.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 flex flex-col space-y-4">
        <div className='space-y-2'>
          <Label className='min-w-32 flex items-center'>
            <ComponentIcon className="h-4 w-4 mr-2" />
            Component
          </Label>
          <ComponentCombobox
            list={componentList}
            value={component.name}
            onChange={handleComponentChange}
          />
        </div>
        {component.properties &&
          <>
            <div className='space-y-2'>
              <Label htmlFor="componentTag" className='min-w-32 flex items-center'>
                <TagIcon className="h-4 w-4 mr-2" />
                Component Tag
              </Label>
              <Input
                id='componentTag'
                defaultValue={component.tag ?? component.name}
                onInput={(event) => handleComponentTageChange(event.currentTarget.value)}
                className="h-8"
              />
              <p className='text-[0.8rem] text-muted-foreground'>This will be a tag for your component. Examples: span, $componentName, $prefix-$componentName, p.</p>
            </div>

            <ComponentPropertyMapper
              component={component}
              onPropertiesChange={handlePropertiesChange}
            />
          </>
        }
      </CardContent>
      <CardFooter className='flex gap-2'>
        {component.properties &&
          (<>
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
          </>)
        }
      </CardFooter>
    </Card>
  );
};

export default CustomConfiguration;
