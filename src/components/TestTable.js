import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import TriggerTest from './TriggerTest';
import ConfirmDeleteModal from './ConfirmDeleteModal'; // Import modal component
import '../styles/TestTable.css'; // Import bee-themed CSS

const TestTable = ({ data, onScreenshot, onDeleteTest }) => {
  const [activeTest, setActiveTest] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testToDelete, setTestToDelete] = useState(null);

  const handleTriggerTest = async (testName) => {
    if (activeTest) return;
    setActiveTest(testName);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate delay
    setActiveTest(null);
  };

  const openDeleteModal = (testTitle) => {
    setTestToDelete(testTitle);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    onDeleteTest(testToDelete); // Call the deletion handler from the parent
    setShowDeleteModal(false); // Close modal after deletion
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
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>
                <TriggerTest
                  onScreenshot={onScreenshot}
                  testName={item.content.testName}
                  onTrigger={() => handleTriggerTest(item.content.testName)}
                  disabled={activeTest && activeTest !== item.content.testName}
                />
              </td>
              <td>
                <p dangerouslySetInnerHTML={{ __html: item.content.description }} />
              </td>
              <td>
                <button onClick={() => openDeleteModal(item.title)} className="delete-button">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        testTitle={testToDelete}
      />
    </div>
  );
};

export default TestTable;
