// File path: src/components/Create.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Create.scss';

const Create = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/create');
  };

  return (
    <div className='container'>
      <h2 className='title'>Create Your Design</h2>
      <p className='description'>
        Do you have a design you would like to be printed on a t-shirt, mug, or a wall poster?
      </p>
      <button className='button-create' onClick={handleNavigate}>
        Get Started
      </button>
    </div>
  );
};

export default Create;
