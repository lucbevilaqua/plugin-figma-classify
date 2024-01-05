import React, { useState } from 'react';
import { TabsProps } from './types';

import './styles.css';

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <button
            className={`tab-btn ${index === activeTabIndex ? 'tab-btn-active' : ''}`}
            key={index}
            onClick={() => setActiveTabIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className='separator' />
      <div className="tab-content">{tabs[activeTabIndex].content}</div>
    </div>
  );
};

export default Tabs;
