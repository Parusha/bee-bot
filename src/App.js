import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import TriggerTest from './components/TriggerTest';
import BeeForm from './BeeForm';
import './App.css';

// Accordion component
const Accordion = ({ title, children, isOpen, onToggle }) => (
  <div className="accordion">
    <div className="accordion-header" onClick={onToggle}>
      <h3>{title}</h3>
      <span>{isOpen ? '-' : '+'}</span>
    </div>
    {isOpen && <div className="accordion-body">{children}</div>}
  </div>
);

// Connect to the Socket.IO server
const socket = io('http://localhost:3001');

const App = () => {
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [logMessages, setLogMessages] = useState([]);
  const [activePage, setActivePage] = useState('default'); // State to manage active page
  const [isLogInTestOpen, setIsLogInTestOpen] = useState(true); // Accordion state for Log in Test

  const handleScreenshot = (url) => {
    setScreenshotUrl(url);
  };

  useEffect(() => {
    // Listen for log messages from the server
    socket.on('log', (message) => {
      setLogMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('log');
    };
  }, []);

  // Function to render the content based on the active page
  const renderContent = () => {
    if (activePage === 'triggerTest') {
      return (
        <>
          {/* Accordion for Log in Test (contains TriggerTest, Screenshot, Log Messages) */}
          <Accordion
            title="Log in"
            isOpen={isLogInTestOpen}
            onToggle={() => setIsLogInTestOpen(!isLogInTestOpen)}
          >
            {/* Trigger Test Component */}
            <TriggerTest onScreenshot={handleScreenshot} />

            {/* Screenshot Section */}
            <div className="screenshot-section">
              <h4>Screenshot</h4>
              {screenshotUrl ? (
                <div className="screenshot-container">
                  <img src={`/images/${screenshotUrl}`} alt="Test Screenshot" className="screenshot-image" />
                  <p>
                    <a href={screenshotUrl} target="_blank" rel="noopener noreferrer">
                      View Screenshot
                    </a>
                  </p>
                </div>
              ) : (
                <p>No screenshot available</p>
              )}
            </div>

            {/* Log Messages Section */}
            <div className="log-messages-section">
              <h4>Log Messages</h4>
              <ul className="log-list">
                {logMessages.map((msg, index) => (
                  <li key={index} className="log-message">
                    <img src="/bee-icon.png" alt="Bee Icon" className="bee-icon" />
                    <span className="message-text">{msg}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Accordion>
        </>
      );
    }

    return (
      <div className="default-content">
        <h2><img src="/bee-icon.png" alt="Bee Icon" className="bee-icon" />Welcome to Bee Bot</h2>
        <p>Use the side menu to trigger tests and capture screenshots.</p>
        <p>Bee Bot helps you automate browser tasks efficiently.</p>
        <p>Click "Run Test" to start, and your results will appear here.</p>
      </div>
    );
  };

  return (
    <div className="app-container">
      <header className="header">
        <div>Bee Bot Dashboard</div>
      </header>
      <div className="main-container">
        <aside className="side-menu">
          {/* Side Menu Items */}
          <ul className="menu-list">
            <li className={activePage === 'triggerTest' ? 'active' : ''}>
              <button onClick={() => setActivePage('triggerTest')}>
               Login
              </button>
            </li>
            <li className={activePage === 'default' ? 'active' : ''}>
              <button onClick={() => setActivePage('default')}>
                Home
              </button>
            </li>
          </ul>
        </aside>

        <main className="content">
          {/* Render content based on active page */}
          {renderContent()}

          {/* Display BeeForm below other content */}
          <BeeForm />
        </main>
      </div>
    </div>
  );
};

export default App;
