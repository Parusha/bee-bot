import React from 'react';

const LogMessages = ({ logMessages }) => {
  return (
    <div className="log-messages-section">
      <ul className="log-list">
        {logMessages.map((msg, index) => (
          <li key={index} className="log-message">
            <img src="/bee-icon.png" alt="Bee Icon" className="bee-icon" />
            <span className="message-text">{msg}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogMessages;
