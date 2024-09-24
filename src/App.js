import React, { useState, useEffect } from 'react';
import socket from './services/socket';
import Accordion from './components/Accordion';
import TriggerTest from './components/TriggerTest';
import Screenshot from './components/Screenshot';
import LogMessages from './components/LogMessages';
import BeeForm from './components/BeeForm';
import HomePage from './pages/HomePage';
import accordionData from './data/accordionData.json'; // Ensure this is updated
import './styles/App.css';

const App = () => {
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [logMessages, setLogMessages] = useState([]); // Initialize as empty array
  const [activePage, setActivePage] = useState('default');
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null); // Track open accordion index

  useEffect(() => {
    const logHandler = (message) => {
      console.log('Received log message:', message); // Debugging log
      setLogMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, message];
        return updatedMessages;
      });
    };

    socket.on('log', logHandler);

    return () => {
      socket.off('log', logHandler);
    };
  }, []);

  const toggleAccordion = (index) => {
    // Toggle the accordion, close it if it was open, or open it if it was closed
    setOpenAccordionIndex(prevIndex => (prevIndex === index ? null : index));

    // Clear log messages when opening a new accordion
    if (openAccordionIndex !== index) {
      setLogMessages([]); // Clear log messages when opening a new accordion
      setScreenshotUrl(''); // Reset screenshotUrl when log messages are cleared
    }
  };

  const handleScreenshot = (url) => {
    setScreenshotUrl(url);
  };

  const renderContent = (content, index) => {
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

  const renderContentPage = () => {
    if (activePage === 'triggerTest') {
      return (
        <>
          {accordionData.map((item, index) => (
            <Accordion
              key={index}
              title={item.title}
              isOpen={openAccordionIndex === index} // Only one accordion can be open
              onToggle={() => toggleAccordion(index)} // Use toggle function
            >
              {renderContent(item.content, index)}
            </Accordion>
          ))}
          <div className="screenshot-log-container"> {/* New container */}
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
