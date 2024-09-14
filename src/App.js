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
      <div>Bee Bot Dashboard</div>
    </header>
    <div className="main-container">
      <aside className="side-menu">
        <TriggerTest onScreenshot={handleScreenshot} />
      </aside>

      <main className="content">
        {screenshotUrl && (
          <div className="screenshot-container">
            <h2>Screenshot</h2>
            <img src={screenshotUrl} alt="Test Screenshot" className="screenshot-image" />
            <p>
              <a href={screenshotUrl} target="_blank" rel="noopener noreferrer">
                View Screenshot
              </a>
            </p>
          </div>
        )}
        <BeeForm />
      </main>
    </div>
  </div>
  );
};

export default App;
