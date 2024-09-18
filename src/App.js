import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import TriggerTest from './components/TriggerTest';
import BeeForm from './BeeForm';
import './App.css';

// Connect to the Socket.IO server
const socket = io('http://localhost:3001');

const App = () => {
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [logMessages, setLogMessages] = useState([]);

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

  return (
    <div className="app-container">
      <header className="header">
        <div>Bee Bot Dashboard</div>
      </header>
      <div className="main-container">
        <aside className="side-menu">
          <TriggerTest onScreenshot={handleScreenshot} />
        </aside>

        <main className="content">
          {screenshotUrl ? (
            <div className="screenshot-container">
              <h2>Screenshot</h2>
              {/* Display the dynamically accessed image */}
              <img src={`/images/${screenshotUrl}`} alt="Test Screenshot" className="screenshot-image" />
              <p>
                <a href={screenshotUrl} target="_blank" rel="noopener noreferrer">
                  View Screenshot
                </a>
              </p>
            </div>
          ) : (
            <div className="default-content">
              <h2><img src="/bee-icon.png" alt="Bee Icon" className="bee-icon" />Welcome to Bee Bot</h2>
              <p>Use the side menu to trigger tests and capture screenshots.</p>
              <p>Bee Bot helps you automate browser tasks efficiently.</p>
              <p>Click "Run Test" to start, and your results will appear here.</p>
            </div>
          )}
          <BeeForm />

          {/* Display log messages with bee icon */}
          <div className="log-container">
            <h3>Log Messages</h3>
            <ul className="log-list">
              {logMessages.map((msg, index) => (
                <li key={index} className="log-message">
                  <img src="/bee-icon.png" alt="Bee Icon" className="bee-icon" />
                  <span className="message-text">{msg}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
