import React, { useState, useEffect } from 'react';
import socket from './services/socket';
import TriggerTest from './components/TriggerTest';
import Screenshot from './components/Screenshot';
import LogMessages from './components/LogMessages';
import BeeForm from './components/BeeForm';
import HomePage from './pages/HomePage';
import HowToPage from './pages/HowToPage';
import TestTable from './components/TestTable';
import initialTestSuitDataStructure from './data/testSuitDataStructure.json';
import './styles/App.css';
import CreateTest from './pages/CreateTest/CreateTest';
import beeIconBlack from './assets/bee-icon-black.png'; 
import beeIconWhite from './assets/bee-icon-white.png'; 

const App = () => {
  const [testSuitData, setTestSuitData] = useState(initialTestSuitDataStructure);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [logMessages, setLogMessages] = useState([]);
  const [activePage, setActivePage] = useState('default');
  const [activeSuit, setActiveSuit] = useState(null);
  const [isBeeFormVisible, setIsBeeFormVisible] = useState(false); 

  // Function to load test suit data
  const loadTestSuitData = () => {
    setTestSuitData(initialTestSuitDataStructure);
  };

  // Effect to load test suit data on mount or when needed
  useEffect(() => {
    loadTestSuitData();
  }, []);

  // Socket connection for logging
  useEffect(() => {
    const logHandler = (message) => {
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
    setScreenshotUrl('');
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

  const handleDeleteTest = (testTitle) => {
    const updatedData = testSuitData.map((suit) => ({
      ...suit,
      tests: suit.tests.filter((test) => test.title !== testTitle),
    }));

    setTestSuitData(updatedData);
  };

  const renderTestSuit = () => {
    if (!activeSuit) return null;

    const testSuit = testSuitData.find((suit) => suit.testSuit === activeSuit);
    if (!testSuit) return null;

    return (
      <TestTable
        key={activeSuit}
        data={testSuit.tests}
        onScreenshot={handleScreenshot}
        renderContent={renderContent}
        onDeleteTest={handleDeleteTest}
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
    if (activePage === 'createTest') {
      return <CreateTest />;
    }

    return <HomePage />;
  };

  const handleCreateClick = () => {
    setActivePage('createTest');
  };

  const toggleBeeFormVisibility = () => {
    setIsBeeFormVisible((prev) => !prev);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div>
          <img
            src={isBeeFormVisible ? beeIconWhite : beeIconBlack} 
            alt="Bee Icon"
            className="bee-icon"
            style={{ cursor: 'pointer' }} 
            onClick={toggleBeeFormVisibility}
          />
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

            <li>
              <h4 style={{ color: '#ffba00', margin: '10px 0', fontSize: '20px', fontWeight: 'bold' }}>
                Test Suits
              </h4>
              <hr style={{ border: '1px solid #ffba00', margin: '10px 0' }} />
            </li>

            {testSuitData.map((suit) => (
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
            <li>
              <button
                className="create-button"
                onClick={handleCreateClick}
              >
                + Create Test
              </button>
            </li>
          </ul>
        </aside>

        <main className="content">
          {renderContentPage()}
          {isBeeFormVisible && <BeeForm />}
        </main>
      </div>
    </div>
  );
};

export default App;
