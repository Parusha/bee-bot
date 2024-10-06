import React, { useState, useEffect } from 'react';
import socket from './services/socket';
import TriggerTest from './components/TriggerTest';
import Screenshot from './components/Screenshot';
import LogMessages from './components/LogMessages';
import BeeForm from './components/BeeForm';
import HomePage from './pages/HomePage';
import TestTable from './components/TestTable';
import accordionData from './data/accordionData.json'; // Updated structure with testSuit
import './styles/App.css';

const App = () => {
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [logMessages, setLogMessages] = useState([]); // Initialize as an empty array
  const [activePage, setActivePage] = useState('default'); // Default to 'default' to show the Home page initially
  const [activeSuit, setActiveSuit] = useState(null); // Track the active testSuit

  useEffect(() => {
    const logHandler = (message) => {
      console.log('Received log message:', message);
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

  // Function to clear log messages
  const clearLogMessages = () => {
    setLogMessages([]); // Clears the log messages
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
        <p dangerouslySetInnerHTML={{ __html: content.description }} />
      </>
    );
  };

  // Renders the content for the active test suit
  const renderTestSuit = () => {
    if (!activeSuit) return null;

    const testSuit = accordionData.find((suit) => suit.testSuit === activeSuit);
    if (!testSuit) return null;

    return (
      <TestTable
        key={activeSuit} // Set the key to activeSuit to ensure a new instance is rendered
        data={testSuit.tests} // Pass the tests under the selected testSuit
        onScreenshot={handleScreenshot}
        renderContent={renderContent} // Pass renderContent for each row
      />
    );
  };

  // Renders the entire page content based on activePage
  const renderContentPage = () => {
    if (activePage === 'triggerTest') {
      return (
        <>
          {renderTestSuit()}

          {/* Log Messages and Screenshot Section */}
          <div className="screenshot-log-container">
            <h4>Log Messages</h4>
            {logMessages.length > 0 && screenshotUrl && <Screenshot screenshotUrl={screenshotUrl} />}
            {logMessages.length > 0 && <LogMessages logMessages={logMessages} />}
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
            {/* Ensure Home is the first item */}
            <li className={activePage === 'default' ? 'active' : ''}>
              <button
                onClick={() => {
                  setActivePage('default');
                  setActiveSuit(null); // Clear activeSuit when Home is selected
                }}
              >
                Home
              </button>
            </li>
            {/* Dynamically render testSuit options from accordionData */}
            {accordionData.map((suit) => (
              <li
                key={suit.testSuit}
                className={activeSuit === suit.testSuit ? 'active' : ''}
              >
                <button
                  onClick={() => {
                    setActivePage('triggerTest');
                    setActiveSuit(suit.testSuit); // Set activeSuit when clicked
                    clearLogMessages();
                  }}
                >
                  {suit.testSuit} {/* Display the testSuit name */}
                </button>
              </li>
            ))}
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
