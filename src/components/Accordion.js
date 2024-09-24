import React from 'react';
import '../styles/Accordion.css'; // Optional: if you want to style your Accordion separately

const Accordion = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="accordion">
      <div className="accordion-header" onClick={onToggle}>
        <h3>{title}</h3>
        <span>{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && <div className="accordion-body">{children}</div>}
    </div>
  );
};

export default Accordion;
