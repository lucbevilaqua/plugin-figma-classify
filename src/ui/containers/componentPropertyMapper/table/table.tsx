import React, { useState } from "react";
import { PropertyType, TableProps } from "./types"

import { Settings2 } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/ui/select"
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/components/ui/popover";
import { Label } from "@/ui/components/ui/label";

const TableComponent = ({ component, onTypeChange, onInputValue }: TableProps) => {
  const options: Array<PropertyType> = [
    { value: 'property', label: 'Property', code: '$propertyName="$value"' },
    { value: 'directive', label: 'Directive', code: 'is$value' },
    { value: 'cssClass', label: 'Css Class', code: '$prefix-$value' },
  ]

  const onSelectChange = (propertyName: string, value: string) => {
    onTypeChange(propertyName, options.find(op => op.value === value)!)
  }

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>, propertyName: string, index: number) => {
    onInputValue(event.currentTarget.value, propertyName, index)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Property</TableHead>
          <TableHead>Type of Property</TableHead>
          <TableHead className="w-[120px]">Values</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.keys(component.properties).map((propertyName: string, i: number) => {
          const property = component.properties[propertyName]

          return (
            <TableRow key={propertyName}>
              <TableCell className="font-medium">{propertyName}</TableCell>
              <TableCell>
                <Select onValueChange={(value) => onSelectChange(propertyName, value)} defaultValue={property.type}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select type of the property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline"><Settings2 /></Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Mapped values</h4>
                        <p className="text-sm text-muted-foreground">
                          Set the configuration for the values.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        {property.values.map((item, index: number) => (
                          <div key={item.value} className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor={item.value}>{item.value}</Label>
                            <Input
                              id={item.value}
                              defaultValue={item.code}
                              onInput={(event) => handleInputChange(event, propertyName, index)}
                              className="col-span-2 h-8"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default TableComponent
