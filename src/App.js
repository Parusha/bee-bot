import React, { useState, useEffect } from 'react';
import socket from './services/socket';
import TriggerTest from './components/TriggerTest';
import Screenshot from './components/Screenshot';
import LogMessages from './components/LogMessages';
import BeeForm from './components/BeeForm';
import HomePage from './pages/HomePage';
import TestTable from './components/TestTable'; // Import the TestTable component
import accordionData from './data/accordionData.json'; // Ensure this is updated
import './styles/App.css';

const App = () => {
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [logMessages, setLogMessages] = useState([]); // Initialize as empty array
  const [activePage, setActivePage] = useState('default');

  useEffect(() => {
    const logHandler = (message) => {
      console.log('Received log message:', message); // Debugging log
      setLogMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('log', logHandler);

    return () => {
      socket.off('log', logHandler);
    };
  }, []);

  const handleScreenshot = (url) => {
    setScreenshotUrl(url);
  };

  // Renders the content for each test row in the TestTable
  const renderContent = (content) => {
    return (
      <>
        <TriggerTest
          onScreenshot={handleScreenshot}
          testName={content.testName}
        />
        <h3>Description</h3>
        <p dangerouslySetInnerHTML={{ __html: content.description }} /> {/* Render HTML */}
      </>
    );
  };

  // Renders the entire page content based on activePage
  const renderContentPage = () => {
    if (activePage === 'triggerTest') {
      return (
        <>
          <TestTable
            data={accordionData}
            onScreenshot={handleScreenshot}
            renderContent={renderContent} // Pass renderContent for each row
          />
          
          {/* Log Messages and Screenshot Section */}
          <div className="screenshot-log-container">
            <h4>Log Messages</h4>
            {logMessages.length > 0 && screenshotUrl && <Screenshot screenshotUrl={screenshotUrl} />} {/* Conditional rendering */}
            {logMessages.length > 0 && <LogMessages logMessages={logMessages} />} {/* Ensure it's an array */}
          </div>
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
          {renderContentPage()}
          <BeeForm />
        </main>
      </div>
    </div>
  );
};

export default App;
