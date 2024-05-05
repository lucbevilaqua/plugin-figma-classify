import React, { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client'

import "./ui.css";
import CustomConfiguration from '@/ui/pages/customConfiguration/customConfiguration';
import Codegen from '@/ui/pages/codegen/codegen';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Progress } from './components/ui/progress';

const PROGRESS_INCREMENT = 33.33;
const MAX_PROGRESS = 100;
const PROGRESS_DELAY = 500;

const PluginUI = () => {
  return (
    <App />
  );
};

const App = () => {
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)

  const incrementProgress = useCallback(() => {
    setProgress(prev => prev + PROGRESS_INCREMENT);
  }, []);

  useEffect(() => {
    const timer = setTimeout(incrementProgress, PROGRESS_DELAY)
    setLoading(progress < MAX_PROGRESS)
    return () => loading ? undefined : clearTimeout(timer)
  }, [incrementProgress, progress, loading])

  return (
    loading ? <Progress value={progress} className="w-[60%]" /> :
      <Tabs defaultValue="codegen" className="w-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="codegen">Code</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="settings"><CustomConfiguration /></TabsContent>
        <TabsContent value="codegen"><Codegen /></TabsContent>
      </Tabs>
  );
}

const root = createRoot(document.getElementById('pluginUI')!)
root.render(<PluginUI />)
