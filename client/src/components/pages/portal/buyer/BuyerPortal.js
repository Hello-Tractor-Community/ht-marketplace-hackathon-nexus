import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../../store/slices/authSlice';
import logo from '../../../../assets/images/logo/logo_v_2.png';

import Button from '../../../common/button/Button';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
// const API_URL = 'https://api-netconn.brosfe.com';


const BuyerPortal = () => {
  const navigate = useNavigate();  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  
  const handleLogout = () => {
    dispatch(logout());
    // Redirect the user to the home page
    navigate('/');
  };

  return (
    <div className='admin-portal'>  

<div className='header-container'>
        <div className='logo-container'>
          <img src={logo} alt='hello-tractor logo'></img>

        </div>

        <div>

          <h2>Buyer Portal</h2>
          <h3 className='admin-welcome'>Welcome! You're logged in as <span>{user?.firstName} {user?.lastName}</span></h3>
        </div>
        <div className='logout-container'>
          <Button onClick={handleLogout} variant='secondary'
            className='admin-button-logout'>Logout</Button>
        </div>
      </div>
     
    </div>
  );
};

export default BuyerPortal;

