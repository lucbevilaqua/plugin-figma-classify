import React from 'react';
import { createRoot } from 'react-dom/client'

import "./ui.css";
import CustomConfiguration from '@/ui/pages/customConfiguration/customConfiguration';
import Codegen from '@/ui/pages/codegen/codegen';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

const PluginUI = () => {
  return (
    <Tabs defaultValue="codegen" className="w-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="codegen">Code</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="settings"><CustomConfiguration /></TabsContent>
      <TabsContent value="codegen"><Codegen /></TabsContent>
    </Tabs>
  );
};

const root = createRoot(document.getElementById('pluginUI')!)
root.render(<PluginUI />)
