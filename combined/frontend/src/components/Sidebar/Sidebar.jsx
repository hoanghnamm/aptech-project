import React from 'react';
import './Sidebar.css';

export default function Sidebar({ activeSection, onSelectSection }) {
  const menuItems = [
    { id: 'hero', label: '🏠 Overview & Hero' },
    { id: 'buttons', label: '🔘 Button Gallery' },
    { id: 'cards', label: '🎴 Card Grid' },
    { id: 'modals', label: '💬 Modals & Dialogs' },
    { id: 'tabs', label: '🗂️ Interactive Tabs' },
    { id: 'accordions', label: '↕️ Collapse/Accordion' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>TEST LABORATORY</h3>
      </div>
      <ul className="sidebar-links">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              className={`sidebar-btn ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => onSelectSection(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
