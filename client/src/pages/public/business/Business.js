// File path: src/components/Business.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Business.scss';


const Business = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/business/register');
  };

  return (
    <div className='container'>
      <h2 className='title'>Join as a Business Owner</h2>
      <p className='description'>
        Are you involved in a business in the artisanal and creative space? Welcome to our platform!
      </p>
      <button className='button-business' onClick={handleNavigate}>
        Get Onboard
      </button>
    </div>
  );
};

export default Business;
