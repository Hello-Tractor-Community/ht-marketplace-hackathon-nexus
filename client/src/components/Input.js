// src/components/common/Input/Input.js
import React from 'react';
import './Input.scss';

const Input = ({ label, type = 'text', name, value, onChange, error }) => {
  return (
    <div className="input-group">
      {label && <label htmlFor={name} className="input-group__label">{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`input-group__field ${error ? 'input-group__field--error' : ''}`}
      />
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
};

export default Input;

