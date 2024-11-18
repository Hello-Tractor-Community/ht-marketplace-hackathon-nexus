// src/components/common/Button/Button.js
import React from 'react';
import './Button.scss';

const Button = ({ children, variant = 'primary', type = 'button', onClick, disabled }) => {
  const handleClick = (e) => {
   
    onClick?.(e);
  };

  return (
    <button
      className={`btn btn--${variant}`}
      type={type}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;