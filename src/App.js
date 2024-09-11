import React from 'react';
import TriggerTest from './components/TriggerTest';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <header className="header">
        Bee Bot Dashboard
      </header>
      <main className="content">
        <TriggerTest />
      </main>
    </div>
  );
};

export default App;
