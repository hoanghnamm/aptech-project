import React, { useState } from 'react';

export default function Navbar({ onNavigate, currentPage }) {
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'home', label: 'Overview' },
    { id: 'identification', label: 'AI Recognition' },
    { id: 'chatbot', label: 'AI Chatbot' },
    { id: 'nutrition', label: 'AI Nutrition' },
    { id: 'encyclopedia', label: 'Encyclopedia' }
  ];

  return (
    <nav style={{
      height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', backgroundColor: '#FFFFFF', borderBottom: '1px solid rgba(37, 34, 30, 0.08)'
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => onNavigate('home')}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EE6449' }} />
        <span style={{ fontFamily: 'Graphik', fontWeight: 600, fontSize: '22px', color: '#25221E' }}>PawIntel</span>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '24px' }}>
        {navItems.map(item => (
          <span
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              fontFamily: 'Graphik', fontSize: '16px', cursor: 'pointer',
              color: currentPage === item.id ? '#EE6449' : '#25221E',
              fontWeight: currentPage === item.id ? '600' : '400',
              textDecoration: currentPage === item.id ? 'underline' : 'none',
              textUnderlineOffset: '4px'
            }}
          >
            {item.label}
          </span>
        ))}
      </div>

      {/* Function 4: Smart Search Input & User Profile Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <input
          type="text"
          placeholder="Search breeds, symptoms..."
          className="input-text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '240px', padding: '8px 12px' }}
        />
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#F2EFED', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          🐶
        </div>
      </div>
    </nav>
  );
}