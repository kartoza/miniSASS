import React, { useState } from 'react';

const TabbedContent = ({ tabsData, activeTabIndex, onTabChange }) => {
  // Sort tabsData by the date in descending order
  const sortedTabsData = [...tabsData].sort((a, b) => new Date(b.label) - new Date(a.label));

  const handleTabChange = (tabIndex) => {
    onTabChange(tabIndex);
  };

  const handleScrollbarClick = () => {
    // Get the container element that holds the tab buttons
    const container = document.querySelector('.tabs-container');
    
    // Get the current scroll position of the container
    const scrollPosition = container.scrollLeft;
  
    // Calculate the width of the container
    const containerWidth = container.clientWidth;
  
    // Calculate the width of each tab button (assuming all buttons have the same width)
    const buttonWidth = 126;
  
    // Calculate the number of visible tabs (assuming all tabs are visible)
    const visibleTabs = Math.floor(containerWidth / buttonWidth);
  
    // Calculate the new scroll position to move to the next visible tab
    const newScrollPosition = scrollPosition + buttonWidth * visibleTabs;
  
    // Scroll to the new position
    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth',
    });
};


  return (
    <div className="flex flex-col items-start justify-start " >
      <div className="flex items-center">
        <div className="tabs-container flex gap-5 w-[30vw]" style={{ overflowX: 'auto' }}>
          {sortedTabsData.map((tab, index) => (
            <button
              key={tab.id}
              className={`cursor-pointer min-w-[126px] text-base text-center focus:outline-none ${activeTabIndex === index ? 'border-b-4 border-blue-900 text-blue-900' : ''}`}
              onClick={() => handleTabChange(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div
          className="w-4 h-full bg-gray-200 cursor-pointer"
          onClick={handleScrollbarClick}
        ></div>
      </div>
      <div className="w-full" style={{marginTop: '-10px'}}>
        {sortedTabsData.map((tab, index) => (
          <div key={`content_${tab.id}`} style={{ display: activeTabIndex === index ? 'block' : 'none' }}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabbedContent;
