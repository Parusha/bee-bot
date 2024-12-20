import React, { useState } from 'react';
import axios from 'axios';
import './TriggerTest.css'; 

const TriggerTest = ({ onScreenshot, testName }) => {
  const [status, setStatus] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const handleRunTest = async () => {
    setLoading(true); 
    setStatus(''); 
    const formData = JSON.parse(localStorage.getItem('beeFormData')); // Retrieve form data from localStorage


    if (!formData || !formData.url || !formData.username || !formData.password) {
      setStatus('error'); 
      setLoading(false);
      alert('Please complete the form and save it before running the test.'); // Notify the user
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/run-test`, 
        { testName, formData }
      );
      
      setStatus('success'); 
      onScreenshot(response.data.screenshotUrl); 
    } catch (error) {
      console.error('Error triggering test:', error); 
      setStatus('error'); 
    } finally {
      setLoading(false); 
    }
  };

  const getStatusIcon = () => {
    if (loading) return <span className="spinner"></span>; 
    if (status === 'error') return <span className="status-icon error-icon">✘</span>; 
    if (status === 'success') return <span className="status-icon success-icon">✔</span>; 
    return <span className="play-button">▶</span>; 
  };

  const getTestStatusText = () => {
    if (loading) return "Running..."; 
    if (status === 'success') return "Passed"; 
    if (status === 'error') return "Failed"; 
    return "Run Test"; 
  };

  return (
    <div className={`trigger-test-container ${status}`}>
      <span
        className="run-test-link"
        onClick={handleRunTest} 
        style={{ cursor: 'pointer' }} 
      >
        {getStatusIcon()}
        <span className={`text ${status}`}>{getTestStatusText()}</span> 
      </span>
    </div>
  );
};

export default TriggerTest;
