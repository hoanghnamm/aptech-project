import React, { useState } from 'react';
import './Accordion.css';

export default function Accordion({ items, allowMultiple = false }) {
  const [openIndexes, setOpenIndexes] = useState([0]); // Open first item by default

  const handleToggle = (index) => {
    if (allowMultiple) {
      if (openIndexes.includes(index)) {
        setOpenIndexes(openIndexes.filter((i) => i !== index));
      } else {
        setOpenIndexes([...openIndexes, index]);
      }
    } else {
      setOpenIndexes(openIndexes.includes(index) ? [] : [index]);
    }
  };

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        return (
          <div key={index} className={`accordion-item ${isOpen ? 'open' : ''}`}>
            <button
              className="accordion-trigger"
              onClick={() => handleToggle(index)}
              aria-expanded={isOpen}
            >
              <span className="accordion-title">{item.title}</span>
              <span className="accordion-chevron">▼</span>
            </button>
            <div className="accordion-content-wrapper">
              <div className="accordion-content">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
