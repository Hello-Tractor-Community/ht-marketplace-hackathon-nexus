import React from 'react';
import './Input.scss';

const Input = ({
  type = 'text',
  placeholder = 'Enter text',
  value,
  name,
  onChange,
  variant = 'primary', // Default styling variant
  disabled = false,
  className = '', // Accept custom className
  ...props // Allow additional props
}) => {
  const handleChange = (e) => {
    if (!disabled) {
      onChange?.(e);
    }
  };

  return (
    <input
      className={`input input--${variant} ${className}`} // Combine internal and custom classes
      type={type}
      placeholder={placeholder}
      value={value}
      name = {name}
      onChange={handleChange}
      disabled={disabled}
      {...props}
    />
  );
};

export default Input;
