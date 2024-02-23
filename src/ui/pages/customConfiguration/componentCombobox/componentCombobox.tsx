import React, { useState } from 'react';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/ui/components/ui/command';

import { cn } from '@/ui/lib/utils';
import { Button } from '@/ui/components/ui/button';

interface ComponentComboboxProps {
  value: string;
  onChange: (value: string) => void;
  list: Array<any>;
}

const ComponentCombobox = ({ value, onChange, list }: ComponentComboboxProps) => {
  const [open, setOpen] = useState(false)

  const handleComponentChange = (optionValue: string) => {
    onChange(optionValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value ? value : 'Select component...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search components..." />
          <CommandEmpty>No component found.</CommandEmpty>
          <CommandGroup>
            {list.map((co) => (
              <CommandItem key={co.key} value={co.name} onSelect={handleComponentChange}>
                <span>{co.name}</span>
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === co.name ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComponentCombobox;
