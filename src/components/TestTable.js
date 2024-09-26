import React, { useState } from 'react';
import TriggerTest from './TriggerTest';
import '../styles/TestTable.css'; // Import the bee-themed CSS

const TestTable = ({ data, onScreenshot }) => {
  const [activeTest, setActiveTest] = useState(null); // Track which test was triggered

  const handleTriggerTest = (testName) => {
    setActiveTest(testName); // Set the active test name
    console.log(`Triggered test: ${testName}`);
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
