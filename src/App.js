import React, { useState } from 'react';
import TriggerTest from './components/TriggerTest';
import BeeForm from './BeeForm';
import './App.css'; 

const App = () => {
  const [screenshotUrl, setScreenshotUrl] = useState('');

  const handleScreenshot = (url) => {
    setScreenshotUrl(url); 
  };

  return (
    <div className="app-container">
      <header className="header">
      <img src="/path/to/bee-icon.png" alt="Bee Icon" className="bee-icon" />
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
              <img src={screenshotUrl} alt="Test Screenshot" className="screenshot-image" />
              <p>
                <a href={screenshotUrl} target="_blank" rel="noopener noreferrer">
                  View Screenshot
                </a>
              </p>
            </div>
          ) : (
            <div className="default-content">
              <h2>Welcome to Bee Bot</h2>
              <p>Use the side menu to trigger tests and capture screenshots.</p>
              <p>Bee Bot helps you automate browser tasks efficiently.</p>
              <p>Click "Run Test" to start, and your results will appear here.</p>
            </div>
          )}
          <BeeForm />
        </main>
      </div>
    </div>
  );
};

export default App;
