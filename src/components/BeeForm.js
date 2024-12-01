import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable'; // Import Draggable
import axios from 'axios';
import testSuitDataStructure from '../data/testSuitDataStructure.json';
import './BeeForm.css';

const BeeForm = () => {
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [device, setDevice] = useState('mobile');
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [testSuit, setTestSuit] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
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
    if (isTestMode) {
      setTestSuit('');
      setDescription('');
      setFile(null);
      setUploadMessage('');
      setUploadSuccess(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length) {
      setFile(droppedFiles[0]);
    }
  };

  const handleSaveTest = () => {
    if (!file || !testSuit || !description) {
      setUploadMessage('Test suite name, description, and file are required.');
      setUploadSuccess(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('testName', testSuit);

    axios.post(`${process.env.REACT_APP_API_BASE_URL}/upload-test`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        setUploadMessage(response.data.message);
        setUploadSuccess(true);

        const existingSuit = testSuitDataStructure.find(suit => suit.testSuit.toLowerCase() === testSuit.toLowerCase());

        if (existingSuit) {
          existingSuit.tests.push({
            title: `${file.name.replace(/\.[^/.]+$/, "")} Test`,
            content: {
              testName: file.name.replace(/\.[^/.]+$/, ""),
              description: description,
            },
          });
        } else {
          testSuitDataStructure.push({
            testSuit: testSuit,
            tests: [{
              title: `${file.name.replace(/\.[^/.]+$/, "")} Test`,
              content: {
                testName: file.name.replace(/\.[^/.]+$/, ""),
                description: description,
              },
            }],
          });
        }

        return axios.post(`${process.env.REACT_APP_API_BASE_URL}/update-accordion-data`, testSuitDataStructure);
      })
      .then((response) => {
        console.log(response.data.message);
        setFile(null);
      })
      .catch((error) => {
        setUploadMessage('Error uploading the file');
        setUploadSuccess(false);
        console.error('Error uploading the file:', error);
      });
  };

  const handleClearTest = () => {
    setTestSuit('');
    setDescription('');
    setFile(null);
    setUploadMessage('');
    setUploadSuccess(false);
  };

  return (
    <Draggable>
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
                list="testSuitOptions"
              />
              <datalist id="testSuitOptions">
                {testSuitDataStructure.map((suit) => (
                  <option key={suit.testSuit} value={suit.testSuit}>
                    {suit.testSuit}
                  </option>
                ))}
              </datalist>
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
              {uploadMessage ? (
                <div className={`upload-message ${uploadSuccess ? 'success' : 'error'}`}>
                  {uploadMessage}
                </div>
              ) : (
                <button
                  className="save-button"
                  onClick={handleSaveTest}
                  disabled={!testSuit || !description || !file}
                >
                  Save Test
                </button>
              )}
              <button className="clear-button" onClick={handleClearTest}>
                Clear Test
              </button>
            </div>
          </>
        )}
      </div>
    </Draggable>
  );
};

export default BeeForm;
