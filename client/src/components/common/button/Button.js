// src/components/common/Button/Button.js
import React from 'react';
import './Button.scss';

const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  onClick, 
  disabled, 
  className = '',
  ...props
}) => {
  const handleClick = (e) => {
    onClick?.(e);
  };

  return (
    <button
      className={`btn btn--${variant} ${className}`} // Combine internal and custom classes
      type={type}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
