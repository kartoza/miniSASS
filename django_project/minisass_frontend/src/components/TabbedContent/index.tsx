import React, { useState } from 'react';

const TabbedContent = ({ tabsData }) => {
  const [selectedTab, setSelectedTab] = useState(tabsData[0].id);

  const handleTabChange = (tabId) => {
    setSelectedTab(tabId);
  };

  return (
    <div className="flex flex-col items-start justify-start w-full">
      <div className="flex gap-5">
        {tabsData.map((tab) => (
          <button
            key={tab.id}
            className={`cursor-pointer min-w-[126px] text-base text-center focus:outline-none ${selectedTab === tab.id ? 'border-b-4 border-blue-900 text-blue-900' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="w-full">
        {tabsData.map((tab) => (
          <div key={`content_${tab.id}`} style={{ display: selectedTab === tab.id ? 'block' : 'none' }}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabbedContent;
