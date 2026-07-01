import React from 'react';
import './Tabs.css';

export default function Tabs({
  tabs,
  activeTab,
  onTabChange,
}) {
  return (
    <div className="tabs-container">
      <div className="tabs-nav" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`tab-nav-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.icon ? <span className="tab-icon">{tab.icon}</span> : null}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content" role="tabpanel">
        {tabs.find((tab) => tab.key === activeTab)?.content}
      </div>
    </div>
  );
}
