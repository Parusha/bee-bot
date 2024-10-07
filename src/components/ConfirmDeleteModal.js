import React from 'react';
import '../styles/ConfirmDeleteModal.css'; // Import bee-themed modal styling

const ConfirmDeleteModal = ({ show, onClose, onConfirm, testTitle }) => {
  if (!show) return null;

  return (
    <div className="bee-modal-overlay">
      <div className="bee-modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete <strong>{testTitle}</strong>?</p>
        <div className="bee-modal-buttons">
          <button className="bee-confirm-button" onClick={onConfirm}>Confirm</button>
          <button className="bee-cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
