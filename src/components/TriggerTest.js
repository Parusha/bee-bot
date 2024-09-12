import React, { useState } from 'react';
import axios from 'axios';
import './TriggerTest.css'; // Import the CSS file

const TriggerTest = ({ onScreenshot }) => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState('');

  const handleRunTest = async () => {
    setLoading(true);
    setStatus('');
    setScreenshotUrl('');

    try {
      const response = await axios.post('http://localhost:3001/run-test');
      setStatus('success');
      setScreenshotUrl(response.data.screenshotUrl);
      onScreenshot(response.data.screenshotUrl); // Pass the screenshot URL to the parent
    } catch (error) {
      console.error('Error triggering test:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (loading) {
      return <span className="spinner"></span>;
    }
    if (status === 'error') {
      return <span className="status-icon error-icon">✘</span>;
    }
    if (status === 'success') {
      return <span className="status-icon success-icon">✔</span>;
    }
    return <span className="play-button">▶</span>;
  };

  return (
    <div className={`trigger-test-container ${status}`}>
      <span
        className="run-test-link"
        onClick={handleRunTest} // Clickable at all times
        style={{ cursor: 'pointer' }}
      >
        {getStatusIcon()}
        <span className={`text ${status}`}>Login Process Test</span> {/* Test text */}
      </span>
    </div>
  );
};

export default TriggerTest;
