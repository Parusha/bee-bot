import React from 'react';

const Screenshot = ({ screenshotUrl }) => {
  return (
    <div className="screenshot-section">
      <h4>Screenshot</h4>
      {screenshotUrl ? (
        <div className="screenshot-container">
          <img src={`/images/${screenshotUrl}`} alt="Test Screenshot" className="screenshot-image" />
          <p>
            <a href={screenshotUrl} target="_blank" rel="noopener noreferrer">
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
