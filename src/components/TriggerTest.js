import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TriggerTest.css'; // Import the CSS file

const TriggerTest = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // New state for progress
  const [screenshotUrl, setScreenshotUrl] = useState(''); // New state for screenshot URL

  const handleRunTest = async () => {
    setLoading(true);
    setStatus(''); // Reset status
    setProgress(0); // Reset progress
    setScreenshotUrl(''); // Reset screenshot URL

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10; // Increment progress
      });
    }, 500); // Update every 500ms

    try {
      const response = await axios.post('http://localhost:3001/run-test');
      setStatus(`Test completed successfully: ${response.data.message}`);
      setScreenshotUrl(response.data.screenshotUrl); // Set the screenshot URL
    } catch (error) {
      console.error('Error triggering test:', error);
      setStatus(`Error triggering test: ${error.message}`);
    } finally {
      setLoading(false);
      // Progress should be set to 100% if loading is false
      if (progress < 100) setProgress(100);
    }
  };

  useEffect(() => {
    // Cleanup interval if component unmounts before progress completes
    return () => clearInterval();
  }, []);

  return (
    <div className="trigger-test-container">
      <h1>Bee Bot</h1>
      <button className="run-test-button" onClick={handleRunTest} disabled={loading}>
        {loading ? 'Running Test...' : 'Run Login Process Test'}
      </button>
      {loading && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <p className="progress-text">{progress}%</p>
        </div>
      )}
      <p className={`status-message ${status.includes('Error') ? 'error' : 'success'}`}>
        {status}
      </p>
      {screenshotUrl && (
        <div className="screenshot-container">
          <h2>Screenshot</h2>
          <img src={screenshotUrl} alt="Test Screenshot" className="screenshot-image" />
          <p><a href={screenshotUrl} target="_blank" rel="noopener noreferrer">View Screenshot</a></p>
        </div>
      )}
    </div>
  );
};

export default TriggerTest;
