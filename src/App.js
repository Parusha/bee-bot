import React, { useState, useEffect } from 'react';
import socket from './services/socket';
import Accordion from './components/Accordion';
import TriggerTest from './components/TriggerTest';
import Screenshot from './components/Screenshot';
import LogMessages from './components/LogMessages';
import BeeForm from './components/BeeForm';
import HomePage from './pages/HomePage';
import accordionData from './data/accordionData.json';
import './styles/App.css';

const App = () => {
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [logMessages, setLogMessages] = useState([]); // Initialize as empty array
  const [activePage, setActivePage] = useState('default');
  const [openAccordions, setOpenAccordions] = useState({});
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(null); // Track active accordion index

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

  const toggleAccordion = (index) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));

    // Clear active accordion if it's closed
    if (openAccordions[index]) {
      setActiveAccordionIndex(null);
    } else {
      setActiveAccordionIndex(index); // Set the active accordion index if opening
    }
  };

  const handleScreenshot = (url) => {
    setScreenshotUrl(url);
  };

  const renderContent = (content, index) => {
    const isActiveAccordion = activeAccordionIndex === index;

    switch (content.testName) {
      case 'loginTest':
        return (
          <>
            <h3>Login Test</h3>
            <p>Login test is running. Please wait for the result.</p>

            <TriggerTest
              onScreenshot={handleScreenshot}
              testName={content.testName}
            />

            {isActiveAccordion && (
              <>
                <Screenshot screenshotUrl={screenshotUrl} />
                <LogMessages logMessages={logMessages || []} /> {/* Ensure it's an array */}
              </>
            )}
          </>
        );

      case 'logoutInfo':
        return (
          <>
            <h3>Logout Test</h3>
            <p>Logout test is being triggered. Please wait for the result.</p>

            <TriggerTest
              onScreenshot={handleScreenshot}
              testName={content.testName}
            />

            {isActiveAccordion && (
              <>
                <Screenshot screenshotUrl={screenshotUrl} />
                <LogMessages logMessages={logMessages || []} /> {/* Ensure it's an array */}
              </>
            )}
          </>
        );

      default:
        return <p>No test data available for this section.</p>;
    }
  };

  const renderContentPage = () => {
    if (activePage === 'triggerTest') {
      return (
        <>
          {accordionData.map((item, index) => (
            <Accordion
              key={index}
              title={item.title}
              isOpen={openAccordions[index] || false}
              onToggle={() => toggleAccordion(index)}
            >
              {renderContent(item.content, index)}
            </Accordion>
          ))}
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
