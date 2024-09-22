import React, { useState, useEffect } from 'react';
import socket from './services/socket';
import Accordion from './components/Accordion';
import TriggerTest from './components/TriggerTest';
import BeeForm from './components/BeeForm';
import HomePage from './pages/HomePage';
import './styles/App.css';

const App = () => {
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [logMessages, setLogMessages] = useState([]);
  const [activePage, setActivePage] = useState('default');
  const [isLogInTestOpen, setIsLogInTestOpen] = useState(true);

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

  const renderContent = () => {
    if (activePage === 'triggerTest') {
      return (
        <>
          <Accordion
            title="Log in"
            isOpen={isLogInTestOpen}
            onToggle={() => setIsLogInTestOpen(!isLogInTestOpen)}
          >
            <TriggerTest onScreenshot={handleScreenshot} />

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

    return <HomePage />;
  };

  return (
    <div className="app-container">
      <header className="header">
        <div>Bee Bot Dashboard</div>
      </header>
      <div className="main-container">
        <aside className="side-menu">
          <ul className="menu-list">
            <li className={activePage === 'triggerTest' ? 'active' : ''}>
              <button onClick={() => setActivePage('triggerTest')}>Login</button>
            </li>
            <li className={activePage === 'default' ? 'active' : ''}>
              <button onClick={() => setActivePage('default')}>Home</button>
            </li>
          </ul>
        </aside>

        <main className="content">
          {renderContent()}
          <BeeForm />
        </main>
      </div>
    </div>
  );
};

export default App;
