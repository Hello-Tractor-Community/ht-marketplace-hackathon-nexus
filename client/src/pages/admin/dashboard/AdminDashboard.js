import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminProducts from './AdminProducts';
import AdminStaff from './AdminStaff';
import AdminOthers from './AdminOthers';
import AdminBlogs from './AdminBlogs';
import UploadWidgetClaudinary from './UploadWidgetClaudinary';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaCopy, FaTrash } from 'react-icons/fa';


import logo from './assets/images/logo/netconn_engineering.png'
// import bcrypt from 'bcryptjs'; // Import bcryptjs for hashing

import './admin_dashboard.css'; // Import CSS file for styling

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
// const API_URL = 'https://api-netconn.brosfe.com';

const AdminDashboard = () => {
  const navigate = useNavigate();  
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isProductsVisible, setIsProductsVisible] = useState(true);
  const [isBlogsVisible, setIsBlogsVisible] = useState(false);
  const [isStaffVisible, setIsStaffVisible] = useState(false);
  const [isOthersVisible, setIsOthersVisible] = useState(false);
  

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Decode the token and set the user state
      setUser(JSON.parse(atob(token.split('.')[1])));
      
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    // const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with 10 rounds
    try {

      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      console.log("response..",response);
      localStorage.setItem('authToken', response.data.token);

      setUser({
        name: response.data.user.name,
        email: response.data.user.email,
      });
      setError(null);
      
    } catch (error) {
      setError(error.response.data.message);
      // setError(error);
    }
  };

  const handleLogout = () => {
    // Remove the authentication token from the local storage or cookie
    localStorage.removeItem('authToken');
    setUser(null);
    // Redirect the user to the login page
    navigate('/admin');
  };

  function handleToggleVisibility(contentType) {
    // Set the visibility of the content based on the button clicked
    setIsProductsVisible(contentType === 'products');
    setIsBlogsVisible(contentType === 'blog');
    setIsStaffVisible(contentType === 'staff');
    setIsOthersVisible(contentType === 'other');
  }

  if (!user) {
    return (
      <div className="admin-login-page">
        <div className='logo-container'>
          <img src={logo} alt='netconn engineering logo'></img>

        </div>

        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div style={{ display: 'flex', alignItems: 'center', }}>
                <input
                  type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ marginRight: '5px' }}
                />

                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(false)} style={{ cursor: 'pointer', fontSize: '24px' }} />
                ) : (
                  <FaEye onClick={() => setShowPassword(true)} style={{ cursor: 'pointer', fontSize: '24px' }} />
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>

              <button type="submit"
                className='admin-button-login'>Login</button>

            </div>
          </div>



          {error &&
            <div style={{
              color: 'red', textAlign: 'center',
              marginTop: '12px',
            }}><span style={{ backgroundColor: 'lightgrey', }}>{error}</span>
            </div>}
        </form>
      </div>
    );
  }

  return (
    <div className='admin-dashboard'>
      <div className='logo-container'>
        <img src={logo} alt='netconn engineering logo'></img>

      </div>

      <h2>Admin Dashboard</h2>
      <h3 className='admin-welcome'>Welcome back Admin!</h3>
      <button onClick={handleLogout}
        className='admin-button-logout'>Logout</button>
      <div className='admin-items'>
        <div className='admin-buttons-container'>
          <button onClick={() => handleToggleVisibility('products')}
          style={{ color: isProductsVisible ? '#FFD9E8' : '#FFFFFF' }}
          className={isProductsVisible ? 'active' : ''}>
            Products
          </button>
          <button onClick={() => handleToggleVisibility('blog')}
          style={{ color: isBlogsVisible ? '#FFD9E8' : '#FFFFFF',
         }}
         className={isBlogsVisible ? 'active' : ''}>
            Blogs
          </button>
          <button onClick={() => handleToggleVisibility('staff')}
          style={{ color: isStaffVisible ? '#FFD9E8' : '#FFFFFF' }}
          className={isStaffVisible ? 'active' : ''}>
            Staff
          </button>
          <button onClick={() => handleToggleVisibility('other')}
          style={{ color: isOthersVisible ? '#FFD9E8' : '#FFFFFF' }}
          className={isOthersVisible ? 'active' : ''}>
            Other
          </button>
        </div>


        {isProductsVisible && (
          <>
         <AdminProducts />
        
         </>
        )
        }
        {isBlogsVisible && (
          <AdminBlogs />
        )
        }
        {isStaffVisible && (
         <AdminStaff />
        )
        }
        {isOthersVisible && (
          // <div >
          //   <h2>Manage Other stuffs</h2>
          // </div>
          <AdminOthers/>
        )
        }

      </div>


    </div>
  );
};

export default AdminDashboard;

