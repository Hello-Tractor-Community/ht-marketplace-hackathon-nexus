import React from 'react';
import './QuantityErrorModal.css';

const QuantityErrorModal = ({ visible, onClose, cartEmpty }) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-text">
          {cartEmpty
            ? "Your cart is empty. Please add items before proceeding to checkout."
            : "Please enter a valid positive number for the quantity of your items."}
        </p>
        <button className="modal-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default QuantityErrorModal;