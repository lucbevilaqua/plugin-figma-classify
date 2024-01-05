import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client'

import './ui.css'
import "react-figma-plugin-ds/figma-plugin-ds.css";
import { Steps } from '@typings/steps';
import General from '@containers/general/general';
import CustomConfiguration from '@containers/customConfiguration/customConfiguration';
import SelectCustomComponents from '@containers/selectCustomComponents/selectCustomComponents';
import { Tab } from '@components/tabs/types';
import Tabs from '@components/tabs/tabs';

const PluginUI = () => {
  const [step, setStep] = useState<Steps>('selectComponents');

  const Content = useMemo(() => {
    switch (step) {
      case 'selectComponents':
        return <SelectCustomComponents nextStep={() => setStep('setCustomConfiguration')} />

      case 'setCustomConfiguration':
        return <CustomConfiguration />

      default:
        return <General />
    }
  }, [step])

  const tabs: Array<Tab> = [
    { label: 'General', content: <General /> },
    { label: 'Custom', content: <>{Content}</> },
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
