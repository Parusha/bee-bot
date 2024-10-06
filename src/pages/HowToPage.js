import React from 'react';
import '../styles/HowToPage.css';

const HowToPage = () => {
  return (
    <div className="howto-container">
      <h2>How to Use the Bee Bot Dashboard</h2>
      <section>
        <h3>Getting Started</h3>
        <p>
          To get started, log in to the Bee Bot Dashboard and select a test suit from the side menu.
        </p>
      </section>
      <section>
        <h3>Running Tests</h3>
        <p>
          Click on the 'Run Test' button associated with the desired test to execute it.
        </p>
      </section>
      <section>
        <h3>Viewing Results</h3>
        <p>
          After running a test, you will see the log messages and any screenshots taken during the test execution.
        </p>
      </section>
      {/* Add more sections as needed */}
    </div>
  );
};

export default HowToPage;
