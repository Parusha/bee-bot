import React from 'react';

const Accordion = ({ title, children, isOpen, onToggle }) => (
  <div className="accordion">
    <div className="accordion-header" onClick={onToggle}>
      <h3>{title}</h3>
      <span>{isOpen ? '-' : '+'}</span>
    </div>
    {isOpen && <div className="accordion-body">{children}</div>}
  </div>
);

export default Accordion;
