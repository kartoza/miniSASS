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
  <div className="flex flex-col items-start justify-start">
    <div className="flex items-center">
      <div className="tabs-container flex gap-5 w-[30vw]">
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
    </div>
    <div className="flex items-center mt-2.5 w-[30vw]">
      <div
        className="flex justify-between items-center w-full bg-gray-200 rounded-md h-4 cursor-pointer"
        onClick={handleScrollbarClick}
      >
        <div className="w-1/2 h-full flex justify-center items-center text-gray-600">
          {/* Add left arrow icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 0 1 1 1v12a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1zM6 9a1 1 0 0 1 1-1h7.586l-3.293-3.293a1 1 0 1 1 1.414-1.414l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 1 1-1.414-1.414L13.586 10H7a1 1 0 0 1-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="w-1/2 h-full flex justify-center items-center text-gray-600">
          {/* Add right arrow icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 0 1 1 1v12a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1zM6 9a1 1 0 0 1 1-1h7.586l-3.293-3.293a1 1 0 1 1 1.414-1.414l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 1 1-1.414-1.414L13.586 10H7a1 1 0 0 1-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
    <div className="w-full">
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
