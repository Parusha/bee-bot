import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import TriggerTest from './TriggerTest';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import axios from 'axios';
import '../styles/TestTable.css';

const TestTable = ({ data, onScreenshot }) => {
  const [activeTest, setActiveTest] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testToDelete, setTestToDelete] = useState(null);
  const [tests, setTests] = useState(data);
  const [isDeleting, setIsDeleting] = useState(false); // State to manage loading during deletion

  // Sync tests state with incoming data prop
  useEffect(() => {
    setTests(data);
  }, [data]);

  const handleTriggerTest = async (testName) => {
    if (activeTest) return;
    setActiveTest(testName);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate delay for test
    setActiveTest(null);
  };

  const handleDeleteTest = async (testTitle) => {
    setIsDeleting(true);
    try {
      const response = await axios.post('http://localhost:3001/delete-test', { testTitle });
  
      if (response.status === 200) {
        setTests((prevTests) => {
          const index = prevTests.findIndex(item => item.title.trim().toLowerCase() === testTitle.trim().toLowerCase());
          if (index !== -1) {
            const newTests = [...prevTests]; // Create a shallow copy
            newTests.splice(index, 1); // Remove the item at the found index
            return newTests; // Return the new array
          }
          return prevTests; // If not found, return original
        });
      } else {
        console.error('Deletion failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (testTitle) => {
    setTestToDelete(testTitle);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    handleDeleteTest(testToDelete);
    setShowDeleteModal(false); 
    setTestToDelete(null); 
  };

  return (
    <div className="bee-table-container">
      <table className="bee-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Trigger Test</th>
            <th>Description</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>
                <TriggerTest
                  onScreenshot={onScreenshot}
                  testName={item.content.testName}
                  onTrigger={() => handleTriggerTest(item.content.testName)}
                  disabled={activeTest && activeTest !== item.content.testName} // Disable button if another test is active
                />
              </td>
              <td>
                <p dangerouslySetInnerHTML={{ __html: item.content.description }} />
              </td>
              <td>
                <button
                  onClick={() => openDeleteModal(item.title)}
                  className="delete-button"
                  disabled={isDeleting} 
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeleteModal && (
        <ConfirmDeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)} 
          onConfirm={handleDelete} 
          testTitle={testToDelete} 
        />
      )}
    </div>
  );
};

export default TestTable;
