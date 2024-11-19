import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
// const API_URL = 'https://api-netconn.brosfe.com';

const BuyerPortal = () => {
  const navigate = useNavigate();  
  
  

  return (
    <div className='admin-dashboard'>  

      <h2>Buyer Portal</h2>
     
    </div>
  );
};

export default BuyerPortal;

