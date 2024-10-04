import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import './BeeForm.css';

const BeeForm = () => {
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [device, setDevice] = useState('mobile');
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false); // State to toggle between modes
  const [testSuit, setTestSuit] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Check if data exists in local storage
    const savedData = localStorage.getItem('beeFormData');
    if (savedData) {
      const { url, username, password, device } = JSON.parse(savedData);
      setUrl(url);
      setUsername(username);
      setPassword(password);
      setDevice(device);
      setIsFormDisabled(true);
    }
  }, []);

  const handleSave = () => {
    const formData = { url, username, password, device };
    localStorage.setItem('beeFormData', JSON.stringify(formData));
    setIsFormDisabled(true);
  };

  const handleClear = () => {
    localStorage.removeItem('beeFormData');
    setUrl('');
    setUsername('');
    setPassword('');
    setDevice('desktop');
    setIsFormDisabled(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleTestMode = () => {
    setIsTestMode(!isTestMode);
    // Clear the input fields when toggling to the test mode
    if (isTestMode) {
      setTestSuit('');
      setDescription('');
      setFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent default behavior to allow drop
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length) {
      setFile(droppedFiles[0]); // Store the first dropped file
    }
  };

  // Updated handleSaveTest function
  const handleSaveTest = () => {
    if (!file || !testSuit) {
      console.error('Test suite name or file is missing.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Attach the file
    formData.append('testName', testSuit); // Pass test suite name

    axios.post('http://localhost:3001/upload-test', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        console.log(response.data.message); // File uploaded successfully
      })
      .catch((error) => {
        console.error('Error uploading the file:', error);
      });
  };

  return (
    <div className={`bee-form ${isFormDisabled ? 'disabled' : ''}`}>
      <div className="bee-form-header">
        <h2 className="header-label">Bee Form</h2>
        <button className="minimize-button" onClick={toggleMinimize}>
          {isMinimized ? '+' : '-'}
        </button>
        <button className="toggle-button" onClick={toggleTestMode}>
          {isTestMode ? 'Switch to Regular Form' : 'Switch to Test Mode'}
        </button>
      </div>

      {!isMinimized && !isTestMode && (
        <>
          <div className="form-group">
            <label>URL</label>
            <input
              type="text"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isFormDisabled}
            />
          </div>
          <div className="form-group">
            <label>Punter Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isFormDisabled}
            />
          </div>
          <div className="form-group">
            <label>Punter Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isFormDisabled}
            />
          </div>
          <div className="form-group">
            <label>Device</label>
            <div>
              <input
                type="radio"
                value="desktop"
                checked={device === 'desktop'}
                onChange={() => setDevice('desktop')}
                disabled={isFormDisabled}
              />
              <label>Desktop</label>
              <input
                type="radio"
                value="mobile"
                checked={device === 'mobile'}
                onChange={() => setDevice('mobile')}
                disabled={isFormDisabled}
              />
              <label>Mobile</label>
            </div>
          </div>
          <div className="form-actions">
            <button
              className={`save-button ${isFormDisabled ? 'disabled' : ''}`}
              onClick={handleSave}
              disabled={isFormDisabled}
            >
              Save
            </button>
            <button className="clear-button" onClick={handleClear}>
              Clear
            </button>
          </div>
        </>
      )}

      {!isMinimized && isTestMode && (
        <>
          <div className="form-group">
            <label>Test Suite Name</label>
            <input
              type="text"
              placeholder="Enter Test Suite Name"
              value={testSuit}
              onChange={(e) => setTestSuit(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              placeholder="Enter Test Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div
            className="drop-area"
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            style={{ border: '2px dashed #ffba00', padding: '20px', textAlign: 'center' }}
          >
            {file ? (
              <p>{file.name} (File Ready)</p>
            ) : (
              <p>Drag and drop a test file here</p>
            )}
          </div>
          <div className="form-actions">
            <button
              className="save-button"
              onClick={handleSaveTest}
              disabled={!testSuit || !description}
            >
              Save Test
            </button>
            <button className="clear-button" onClick={() => {
              setTestSuit('');
              setDescription('');
              setFile(null);
            }}>
              Clear Test
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BeeForm;
