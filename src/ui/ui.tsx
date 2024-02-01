import React from 'react';
import { createRoot } from 'react-dom/client'

import './ui.css'
import "react-figma-plugin-ds/figma-plugin-ds.css";
import General from '@containers/general/general';
import CustomConfiguration from '@containers/customConfiguration/customConfiguration';
import { Tab } from '@components/tabs/types';
import Tabs from '@components/tabs/tabs';

const PluginUI = () => {
  const tabs: Array<Tab> = [
    { label: 'General', content: <General /> },
    { label: 'Custom', content: <CustomConfiguration /> },
  ]

  return (
    <div className='plugin-container'>
      <Tabs
        tabs={tabs}
      />
    </div>
  );
};

const root = createRoot(document.getElementById('pluginUI')!)
root.render(<PluginUI />)
