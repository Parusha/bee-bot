import React, { useState, useEffect } from 'react';
import './BeeForm.css'; // Ensure this CSS file is updated as well

const BeeForm = () => {
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [device, setDevice] = useState('desktop');
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false); 

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

  return (
    <div className={`bee-form ${isFormDisabled ? 'disabled' : ''}`}>
      <div className="bee-form-header">
        <h2 className="header-label">Bee Form</h2>
        <button className="minimize-button" onClick={toggleMinimize}>
          {isMinimized ? '+' : '-'} {/* Toggle between + and - */}
        </button>
      </div>

      {!isMinimized && (
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
    </div>
  );
};

export default BeeForm;
