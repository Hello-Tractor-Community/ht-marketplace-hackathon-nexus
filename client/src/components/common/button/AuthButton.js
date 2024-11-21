import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import Button from './Button';
import LoginModal from '../../features/auth/LoginModal';
import ProfileButton from './ProfileButton';
import './AuthButton.scss';

const AuthButton = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authType, setAuthType] = useState(null); // 'customer' or 'business'
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const handleAuthTypeSelect = (type) => setAuthType(type);

  const handleLogin = () => setShowLoginModal(true);

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setAuthType(null);
  };

  return (
    <div className="authbutton-container">
      {isAuthenticated ? (
        <ProfileButton user={user} />
      ) : (
        <>
          <Button
            variant="primary"
            onClick={handleLogin}
           
          >
            <FaUserCircle />
            Login
          </Button>
          {showLoginModal && (
            <LoginModal
              authType={authType}
              onClose={handleCloseModal}
              handleAuthTypeSelect={handleAuthTypeSelect}
              showLoginModal = {showLoginModal}
              setShowLoginModal = {setShowLoginModal}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AuthButton;
