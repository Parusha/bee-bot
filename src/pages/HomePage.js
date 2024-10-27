
import React from 'react';
import '../styles/HomePage.css';

const HomePage = () => (
  <div className="default-content">
    <h2>
      <img src="/bee-icon.png" alt="Bee Icon" className="bee-icon" />
      Welcome to Bee Bot
    </h2>
    <p>Use the side menu to trigger tests and capture screenshots.</p>
    <p>Bee Bot helps you automate browser tasks efficiently.</p>
    <p>Click "Run Test" to start, and your results will appear here.</p>
  </div>
);

export default HomePage;
