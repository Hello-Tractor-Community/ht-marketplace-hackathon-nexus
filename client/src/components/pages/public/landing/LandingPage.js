import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// 
import { AppContext } from '../../../../store/AppContext';
// import landingPagePromo from '../assets/images/landing-promo.jpg';

import './LandingPage.scss';
import logo from '../../../../assets/images/logo/HT_LOGO ICON_RGB_Orange.png';
import bgimg from '../../../../assets/images/patterns/HT_PATTERNS_RGB-09.png';
import landingPagePromo1 from '../../../../assets/images/characters/Aziza Gesture.png';
import landingPagePromo2 from '../../../../assets/images/characters/Gitonga Gesture.png';
import landingPagePromo3 from '../../../../assets/images/characters/Sasha Boots Neutral.png';

const production = process.env.NODE_ENV === 'production';
const REACT_APP_API_URL = production ? process.env.REACT_APP_API_URL_PROD : process.env.REACT_APP_API_URL_DEV;

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserLogged } = useContext(AppContext);
  const navigate = useNavigate();

  const images = [landingPagePromo1, landingPagePromo2, landingPagePromo3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);

  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);

      setTimeout(() => {
        setCurrentImageIndex(nextImageIndex);
        setNextImageIndex((nextImageIndex + 1) % images.length);
        setFading(false);
      }, 1000); // Match this to the CSS animation duration
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [nextImageIndex, images.length]);

  const handleLogin = () => {
    setUserLogged(true);
    navigate('/home');
  };


  return (
    <div className="landing-page">
      <div className="promo-section">
        <img
          src={images[0]}
          className={`promo-image`}
          alt="Current promo"
        />
    
        <h2 className="promo-text">Hello Tractor serving your tractor and.</h2>
      </div>
      <div className="login-section">
        <img src={logo} alt="Logo" className="logo" />
        <img src={bgimg} alt="Background image" className="bg-image" />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button onClick={handleLogin} className="login-button">
          Login
        </button>
        <p className="signup-text">
          Don't have an account?{' '}
          <span onClick={() => navigate('/signup')} className="signup-link">
            Sign Up
          </span>
        </p>
        <button onClick={() => navigate('/home')} className="skip-button">
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default LandingPage;