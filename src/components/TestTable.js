import React, { useState } from 'react';
import TriggerTest from './TriggerTest';
import '../styles/TestTable.css'; // Import the bee-themed CSS

const TestTable = ({ data, onScreenshot }) => {
  const [activeTest, setActiveTest] = useState(null); // Track which test was triggered

  const handleTriggerTest = async (testName) => {
    if (activeTest) return; 

    setActiveTest(testName); // Set the active test name
    console.log(`Triggered test: ${testName}`);

    // Simulating an async test operation
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate 3-second test delay

    setActiveTest(null); // Reset the active test after the delay
  };

  return (
    <div className="bee-table-container">
      <table className="bee-table">
        <thead>
          <tr>
            <th>#</th> {/* Column for numbers */}
            <th>Title</th>
            <th>Trigger Test</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td> {/* Displaying the row number (1-based index) */}
              <td>{item.title}</td>
              <td>
                <TriggerTest
                  onScreenshot={onScreenshot}
                  testName={item.content.testName}
                  onTrigger={() => handleTriggerTest(item.content.testName)} // Trigger function for handling test
                  disabled={activeTest && activeTest !== item.content.testName} // Disable other buttons if a test is running
                />
              </td>
              <td>
                <p dangerouslySetInnerHTML={{ __html: item.content.description }} /> {/* Render description with HTML */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestTable;
