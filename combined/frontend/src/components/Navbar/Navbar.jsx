import React from 'react';
import './Navbar.css';

export default function Navbar({ onSelectTab, activeTab }) {
  return (
    <nav className="navbar">
      <div className="logo">
        <span className="logo-spark">✨</span> ComponentLab
      </div>
      <ul className="nav-links">
        <li>
          <button 
            className={`nav-btn ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => onSelectTab('hero')}
          >
            Dashboard
          </button>
        </li>
        <li>
          <button 
            className={`nav-btn ${activeTab === 'components' ? 'active' : ''}`}
            onClick={() => onSelectTab('components')}
          >
            UI Kit
          </button>
        </li>
      </ul>
    </nav>
  );
}
