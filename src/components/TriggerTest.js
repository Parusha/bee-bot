import React, { useState } from 'react';
import axios from 'axios';
import './TriggerTest.css'; // Import the CSS file

const TriggerTest = ({ onScreenshot }) => {
  const [status, setStatus] = useState(''); // To track success, error, or default state
  const [loading, setLoading] = useState(false); // To manage the loading spinner

  const handleRunTest = async () => {
    setLoading(true);  // Start the loading spinner
    setStatus('');  // Reset the status before each test run

    // Retrieve form data from local storage
    const formData = JSON.parse(localStorage.getItem('beeFormData'));

    // Check if form data is available
    if (!formData || !formData.url || !formData.username || !formData.password) {
      setStatus('error');
      setLoading(false);
      alert('Please complete the form and save it before running the test.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/run-test', {
        testName: 'loginTest', // Pass the test name dynamically
        formData: formData // Include form data in the request
      });
      
      setStatus('success');  // Set the status to success when the test passes
      onScreenshot(response.data.screenshotUrl);  // Pass the screenshot URL to the parent
    } catch (error) {
      console.error('Error triggering test:', error); // Handle any error from the test
      setStatus('error');  // Set status to error on failure
    } finally {
      setLoading(false);  // Stop the loading spinner once the test completes
    }
  };



  const getStatusIcon = () => {
    if (loading) {
      return <span className="spinner"></span>;  // Show a spinner when loading
    }
    if (status === 'error') {
      return <span className="status-icon error-icon">✘</span>;  // Show error icon on failure
    }
    if (status === 'success') {
      return <span className="status-icon success-icon">✔</span>;  // Show success icon when successful
    }
    return <span className="play-button">▶</span>;  // Show the play button by default
  };

  const getTestStatusText = () => {
    if (loading) return "Run";  // Show "Run" while loading
    if (status === 'success') return "Passed";  // Show "Passed" on success
    if (status === 'error') return "Failed";  // Show "Failed" on error
    return "Run";  // Default text
  };

  return (
    <div className={`trigger-test-container ${status}`}>
      <span
        className="run-test-link"
        onClick={handleRunTest} // Always clickable, allowing the test to be rerun
        style={{ cursor: 'pointer' }}
      >
        {getStatusIcon()}  {/* Show the correct icon based on status */}
        <span className={`text ${status}`}>{getTestStatusText()}</span>  {/* Display the test status text */}
      </span>
    </div>
  );
};

export default TriggerTest;
