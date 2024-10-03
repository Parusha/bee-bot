import React, { useState, useEffect } from 'react';
import './BeeForm.css'; // Ensure this CSS file is updated as well

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

  const handleSaveTest = () => {
    // Implement saving test suite logic here
    console.log('Saving test suite:', testSuit, description, file);
  };

  return (
    <div className={`bee-form ${isFormDisabled ? 'disabled' : ''}`}>
      <div className="bee-form-header">
        <h2 className="header-label">Bee Form</h2>
        <button className="minimize-button" onClick={toggleMinimize}>
          {isMinimized ? '+' : '-'} {/* Toggle between + and - */}
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
              // Always enable input in test mode
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              placeholder="Enter Test Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              // Always enable input in test mode
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
              className={`save-button ${isFormDisabled ? 'disabled' : ''}`}
              onClick={handleSaveTest}
              disabled={!testSuit || !description} // Disable only if fields are empty
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
