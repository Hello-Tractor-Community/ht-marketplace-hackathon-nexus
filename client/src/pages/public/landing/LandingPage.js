import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// 
import { AppContext } from '../../features/AppContext';
// import landingPagePromo from '../assets/images/landing-promo.jpg';

import './LandingPage.scss';
import logo from '../../../assets/images/logo.png';
import bgimg from '../../../assets/images/promo/4.png';
import landingPagePromo1 from '../../../assets/images/promo/1.jpg';
import landingPagePromo2 from '../../../assets/images/promo/2.jpg';
import landingPagePromo3 from '../../../assets/images/promo/3.jpg';

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

//   useEffect(() => {
//     const verifyTransaction = async () => {
//         const txRef = localStorage.getItem('currentTransaction');
//         console.log('txRef landing page:', txRef);
//         if (txRef) {
//             try {
//                 const response = await axios.get(`${REACT_APP_API_URL}/transaction/verify-transaction/${txRef}`);
//                 if (response.data.status === 'success') {

//                     console.log('Transaction verified successfully. Redirecting.');
//                     navigate('/orderConfirmation');
//                 } else {

//                     navigate('/orderConfirmation');
//                 }
//             } catch (error) {

//                 console.error('Error checking transaction:', error);
//                 navigate('/orderConfirmation');
//             }
//         }
//     };

//     verifyTransaction();
// }, []);


  return (
    <div className="landing-page">
      <div className="promo-section">
        {/* <img src={landingPagePromo} alt="Landing page promo" className="promo-image"
          onError={(e) => {
            console.error("Failed to load image:", e);
            e.target.style.display = 'none';
          }}
        /> */}
        <img
          src={images[0]}
          className={`promo-image`}
          alt="Current promo"
        />
        {/* <img
          src={images[nextImageIndex]}
          className={`promo-image ${fading ? 'fade-in' : 'fade-out'}`}
          alt="Next promo"
        /> */}
     
        <h2 className="promo-text">Made locally with craftsmanship and love.</h2>
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