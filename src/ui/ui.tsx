import React from 'react';
import { createRoot } from 'react-dom/client'

import "./ui.css";
import CustomConfiguration from '@/ui/pages/customConfiguration/customConfiguration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

const PluginUI = () => {
  return (
    <Tabs defaultValue="general" className="w-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="settings" disabled>Settings (in soon)</TabsTrigger>
      </TabsList>
      <TabsContent value="general"><CustomConfiguration /></TabsContent>
      <TabsContent value="settings"><CustomConfiguration /></TabsContent>
    </Tabs>
  );
};

const root = createRoot(document.getElementById('pluginUI')!)
root.render(<PluginUI />)
