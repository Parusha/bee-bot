import React, { useState, useEffect } from 'react';
import socket from './services/socket';
import TriggerTest from './components/TriggerTest';
import Screenshot from './components/Screenshot';
import LogMessages from './components/LogMessages';
import BeeForm from './components/BeeForm';
import HomePage from './pages/HomePage';
import HowToPage from './pages/HowToPage';
import TestTable from './components/TestTable';
import testSuitDataStructure from './data/testSuitDataStructure.json';
import './styles/App.css';

const App = () => {
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [logMessages, setLogMessages] = useState([]);
  const [activePage, setActivePage] = useState('default');
  const [activeSuit, setActiveSuit] = useState(null);

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

  const clearLogMessages = () => {
    setLogMessages([]);
  };

  const renderContent = (content) => {
    return (
      <>
        <TriggerTest onScreenshot={handleScreenshot} testName={content.testName} />
        <h3>Description</h3>
        <p dangerouslySetInnerHTML={{ __html: content.description }} />
      </>
    );
  };

  const renderTestSuit = () => {
    if (!activeSuit) return null;

    const testSuit = testSuitDataStructure.find((suit) => suit.testSuit === activeSuit);
    if (!testSuit) return null;

    return (
      <TestTable
        key={activeSuit}
        data={testSuit.tests}
        onScreenshot={handleScreenshot}
        renderContent={renderContent}
      />
    );
  };

  const renderContentPage = () => {
    if (activePage === 'howTo') {
      return <HowToPage />;
    }

    if (activePage === 'triggerTest') {
      return (
        <>
          {renderTestSuit()}
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
        <div>
          <img src="/bee-logo-white.png" alt="Bee Logo" className="bee-logo" />
          Bee Bot Dashboard
        </div>
      </header>
      <div className="main-container">
        <aside className="side-menu">
          <ul className="menu-list">
            <li className={activePage === 'default' ? 'active' : ''}>
              <button
                onClick={() => {
                  setActivePage('default');
                  setActiveSuit(null);
                }}
              >
                Home
              </button>
            </li>

            {/* Add How To Page Link */}
            <li className={activePage === 'howTo' ? 'active' : ''}>
              <button
                onClick={() => {
                  setActivePage('howTo');
                  setActiveSuit(null);
                }}
              >
                How To
              </button>
            </li>

            {/* Add a heading for Test Suits */}
            <li>
              <h4 style={{ color: '#ffba00', margin: '10px 0', fontSize: '20px', fontWeight: 'bold' }}>
                Test Suits
              </h4>
            </li>

            {/* Dynamically render testSuit options from testSuitDataStructure */}
            {testSuitDataStructure.map((suit) => (
              <li key={suit.testSuit} className={activeSuit === suit.testSuit ? 'active' : ''}>
                <button
                  onClick={() => {
                    setActivePage('triggerTest');
                    setActiveSuit(suit.testSuit);
                    clearLogMessages();
                  }}
                >
                  {suit.testSuit}
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
