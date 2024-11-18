import React from 'react';
import './ErrorModal.css';

const ErrorModal = ({ visible, onClose, message }) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p className="modal-text">{message}</p>
        <button className="modal-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;