// src/components/LoginModal/LoginModal.js
import React, { useState } from 'react';
import { loginUser } from '../../../store/slices/authSlice';
import Button from '../common/button/Button';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './LoginModal.scss';

const LoginModal = ({ onClose, onRegister }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Make sure to insert all values.');
      return;
    }

    try {
      // 1. Register the user first
      const response = await dispatch(loginUser({
        email: email,
        password: password
      }));

    //   console.log("response login..",response);

      const success = response.payload.success;

      const user = response.payload.user;

    //   console.log("sucess..", success);
    //   console.log("data..", user);

      // Check if we have a successful response with user data
      if (!success || !user?._id) {
        throw new Error(user.error || 'User login failed');
      }
     
      navigate('/place-holder');

    } catch (error) {
      console.error('Login failed:', error);
      alert(error.message || 'Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    console.log('Logging in with Google');
  };

  const handleFacebookLogin = () => {
    // Implement Facebook login logic here
    console.log('Logging in with Facebook');
  };

  const handleRegister = () => {
    onRegister();
  };

  return (
    <div className="login-modal__overlay">
      <div className="login-modal__content">
        <div className="login-modal__header">
          <h2>Login</h2>
          <button className="login-modal__close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="login-modal__body">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
          <div className="login-modal__divider">
            <span>or</span>
          </div>
          <div className="login-modal__social">
          <Button variant="quaternary" onClick={handleGoogleLogin}>
            <FaGoogle />
            <span>Continue with Google</span>
          </Button>
          <Button variant="tertiary" onClick={handleFacebookLogin}>
            <FaFacebookF />
            <span>Continue with Facebook</span>
          </Button>
          </div>
          <div className="login-modal__register">
          <p>Or simply <span style={{fontWeight: 'bold', fontSize:'1.1rem'}}>&#8594;</span></p>
          <Button variant="link" onClick={handleRegister}>
            Register
          </Button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginModal;