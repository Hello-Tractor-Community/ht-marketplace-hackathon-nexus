// File path: src/components/About.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.scss';

const About = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/listing');
  };

  return (
    <div className='container'>
      <h2 className='title'>About Us</h2>
      <p className='description'>
        Welcome to hello tractor commerce. We specialize in finding you the right deals for your second hand tractor needs.
      </p>
      <button className='button-about' onClick={handleNavigate}>
        View Listings
      </button>
    </div>
  );
};

export default About;
