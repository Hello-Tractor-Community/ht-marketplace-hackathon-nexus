import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../../../store/slices/authSlice';
import logo from '../../../../../assets/images/logo/logo_v_2.png';

import Listings from './Listings';
import Sellers from './Sellers';
import Mailbox from './Mailbox';
import Dashboard from './Dashboard';
import Profile from './Profile';

import './AdminPortal.scss'; // Import CSS file for styling
import Button from '../../../../common/button/Button';

const AdminPortal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [error, setError] = useState(null);

  const [isListingsVisible, setIsListingsVisible] = useState(true);
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  const [isMailboxVisible, setIsMailboxVisible] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isSellerVisible, setIsSellerVisible] = useState(false);
  const handleLogout = () => {
    dispatch(logout());
    // Redirect the user to the home page
    navigate('/');
  };

  function handleToggleVisibility(contentType) {
    // Set the visibility of the content based on the button clicked
    setIsListingsVisible(contentType === 'listings');
    setIsDashboardVisible(contentType === 'dashboard');
    setIsMailboxVisible(contentType === 'mailbox');
    setIsProfileVisible(contentType === 'profile');
    setIsSellerVisible(contentType === 'seller');
  }

  return (
    <div className='admin-portal'>
      <div className='header-container'>
        <div className='logo-container'>
          <img src={logo} alt='hello-tractor logo'></img>

        </div>

        <div>

          <h2>Admin Portal</h2>
          <h3 className='admin-welcome'>Welcome! You're logged in as <span>{user?.firstName} {user?.lastName}</span></h3>
        </div>
        <div className='logout-container'>
          <Button onClick={handleLogout} variant='secondary'
            className='admin-button-logout'>Logout</Button>
        </div>
      </div>
      <div className='admin-items'>
        <div className='admin-buttons-container'>

          <Button onClick={() => handleToggleVisibility('listings')}
            variant='mini'

            className={isListingsVisible ? 'active' : ''}>
            Listings
          </Button>
          <Button onClick={() => handleToggleVisibility('mailbox')}
            variant='mini'

            className={isMailboxVisible ? 'active' : ''}>
            Message
          </Button>
          <Button onClick={() => handleToggleVisibility('seller')}
            variant='mini'

            className={isSellerVisible ? 'active' : ''}>
            Sellers
          </Button>
          <Button onClick={() => handleToggleVisibility('dashboard')}
            variant='mini'

            className={isDashboardVisible ? 'active' : ''}>
            Dashboard
          </Button>
          <Button onClick={() => handleToggleVisibility('profile')}
            variant='mini'

            className={isProfileVisible ? 'active' : ''}>
            Profile
          </Button>
        </div>
        <div className='admin-content'>

          {isListingsVisible && (
            <>
              <Listings />

            </>
          )
          }
          {isMailboxVisible && (
            <>
              <Mailbox />

            </>
          )
          }
          {isSellerVisible && (
            <>
              <Sellers />

            </>
          )
          }

          {isDashboardVisible && (
            <>
              <Dashboard />

            </>
          )
          }
          {isProfileVisible && (
            <>
              <Profile />

            </>
          )
          }
        </div>

      </div>


    </div>
  );
};

export default AdminPortal;

