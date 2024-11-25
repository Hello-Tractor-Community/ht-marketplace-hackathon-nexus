import React from 'react';

// Simple wrapper component for web applications
const AppWrapper = ({ children }) => {
  return <div className="web-root">{children}</div>;
};

export default AppWrapper;