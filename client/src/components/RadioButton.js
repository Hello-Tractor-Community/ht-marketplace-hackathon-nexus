import React from 'react';
import './RadioButton.css';

const RadioButton = ({ label, selected, onToggle }) => (
  <button className="radio-button" onClick={onToggle}>
    <div className={`radio-outer ${selected ? 'selected' : ''}`}>
      {selected && <div className="radio-inner" />}
    </div>
    <span className="label">{label}</span>
  </button>
);

export default RadioButton;