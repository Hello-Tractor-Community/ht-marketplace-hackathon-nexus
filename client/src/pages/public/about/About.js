// File path: src/components/About.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.scss';

const About = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/product');
  };

  return (
    <div className='container'>
      <h2 className='title'>About Us</h2>
      <p className='description'>
        Welcome to our company. We specialize in bringing your creative designs to life on a variety of products.
      </p>
      <button className='button-about' onClick={handleNavigate}>
        View Products
      </button>
    </div>
  );
};

export default About;
