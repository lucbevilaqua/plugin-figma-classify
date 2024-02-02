import React, { useEffect, useState } from 'react';

import './styles.css'
import { PluginMessage } from '@typings/pluginMessages';
import { SetCustomConfigurationProps } from './types';
import { CustomConfig, ComponentProperties } from '@typings/config';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/ui/components/ui/command';
import { Button } from '@/ui/components/ui/button';
import { CheckIcon, SaveAllIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/components/ui/popover';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { cn } from '@/ui/lib/utils';
import ComponentPropertyMapper from '../../containers/componentPropertyMapper/componentPropertyMapper';

const CustomConfiguration = ({ }: SetCustomConfigurationProps) => {
  const [componentList, setComponentList] = useState<Array<any>>([]);
  const [component, setComponent] = useState<CustomConfig>({} as CustomConfig);
  const [open, setOpen] = useState(false)

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

  const handleComponentChange = (optionValue: string) => {
    setComponent(componentList.find((component) => component.name === optionValue))
    setOpen(false)
    parent.postMessage({ pluginMessage: { action: 'setComponentFocus', payload: component.key } }, '*');
  }

  const handlePropertiesChange = (properties: ComponentProperties) => {
    setComponent(prevMappings => ({
      ...prevMappings,
      properties
    }));
  };

  const handleComponentTypeChange = () => {
    setComponent(prevMappings => ({
      ...prevMappings,
      hasComponentNameTag: !prevMappings.hasComponentNameTag
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Let's start configuring !</CardTitle>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {component.name ? component.name : 'Enter the name of the component or instance...'}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search framework..." className="h-9" />
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {componentList.map((co) => (
                  <CommandItem key={co.key} value={co.name} onSelect={handleComponentChange}>
                    <span>{co.name}</span>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        component.name === co.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="space-y-2">
        {component.properties &&
          <>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Below are all the properties created for this component, let's map them to generate the most appropriate code. If necessary, call a member of your engineering team.
            </p>
            <ComponentPropertyMapper
              component={component}
              onPropertiesChange={handlePropertiesChange}
            />
          </>
        }
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSave}
        >
          <SaveAllIcon size={24} className="mr-2 h-4 w-4" />
          Salvar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CustomConfiguration;
