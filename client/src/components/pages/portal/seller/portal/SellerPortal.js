import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { logout } from '../../../../../store/slices/authSlice';
import logo from '../../../../../assets/images/logo/logo.png';

import SellerListings from './SellerListings';

import './SellerPortal.scss'; // Import CSS file for styling


const SellerPortal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { user } = useSelector((state) => state.auth);

  const [error, setError] = useState(null);
  
  const [isListingsVisible, setIsListingsVisible] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    // Redirect the user to the home page
    navigate('/home');
  };

  function handleToggleVisibility(contentType) {
    // Set the visibility of the content based on the button clicked
    setIsListingsVisible(contentType === 'listings');
  }

  return (
    <div className='admin-dashboard'>
      <div className='logo-container'>
        <img src={logo} alt='hello-tractor logo'></img>

      </div>

      <h2>Seller Portal</h2>
      <h3 className='admin-welcome'>Welcome! You're logged in as {user?.firstName} {user?.lastName}</h3>
      <button onClick={handleLogout}
        className='admin-button-logout'>Logout</button>
      <div className='admin-items'>
        <div className='admin-buttons-container'>
          <button onClick={() => handleToggleVisibility('listings')}
          style={{ color: isListingsVisible ? '#FFD9E8' : '#FFFFFF' }}
          className={isListingsVisible ? 'active' : ''}>
            Listings
          </button>
        </div>


        {isListingsVisible && (
          <>
         <SellerListings />
        
         </>
        )
        }
       
      </div>


    </div>
  );
};

export default SellerPortal;

