"use client";
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Accordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="accordion" role="region" aria-label="Product details">
      {items.map((item, index) => (
        <div key={index} className="accordion-item">
          <button
            className={`accordion-header ${openIndex === index ? 'open' : ''}`}
            onClick={() => toggleItem(index)}
            aria-expanded={openIndex === index}
            aria-controls={`accordion-content-${index}`}
          >
            <span className="accordion-title">{item.title}</span>
            <ChevronDown size={20} className="accordion-icon" />
          </button>
          <div
            id={`accordion-content-${index}`}
            className={`accordion-content ${openIndex === index ? 'open' : ''}`}
            role="region"
            aria-labelledby={`accordion-header-${index}`}
          >
            <div className="accordion-body">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

