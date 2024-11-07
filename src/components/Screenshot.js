import React from 'react';

const Screenshot = ({ screenshotUrl }) => {
  // Get the base URL from the environment variable
  const serverUrl = process.env.REACT_APP_SOCKET_SERVER_URL;

  return (
    <div className="screenshot-section">
      <h4>Screenshot</h4>
      {screenshotUrl ? (
        <div className="screenshot-container">
          <img 
            src={`${serverUrl}/images/${screenshotUrl}.png`} 
            alt="Test Screenshot" 
            className="resized-image" 
          />
          <p>
            <a 
              href={`${serverUrl}/images/${screenshotUrl}.png`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              View Screenshot
            </a>
          </p>
        </div>
      ) : (
        <p>No screenshot available</p>
      )}
    </div>
  );
};

export default Screenshot;
