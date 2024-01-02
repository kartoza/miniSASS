import React, { useState } from 'react';

const TabbedContent = ({ tabsData, activeTabIndex, onTabChange }) => {
  const handleTabChange = (tabIndex) => {
    onTabChange(tabIndex);
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col items-start justify-start">
        <div className="flex gap-5">
          {tabsData.map((tab, index) => (
            <button
              key={tab.id}
              className={`cursor-pointer min-w-[126px] text-base text-center focus:outline-none ${activeTabIndex === index ? 'border-b-4 border-blue-900 text-blue-900' : ''}`}
              onClick={() => handleTabChange(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="w-full">
          {tabsData.map((tab, index) => (
            <div key={`content_${tab.id}`} style={{ display: activeTabIndex === index ? 'block' : 'none' }}>
              {tab.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabbedContent;
