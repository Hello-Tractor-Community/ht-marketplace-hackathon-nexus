import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import Button from '../button/Button';
import LoginModal from '../../components/LoginModal';
import AuthButton from '../../components/AuthButton';
import './NavBar.scss';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);


  const categoryTitles = {
    fashion: 'Fashion',
    homeDecor: 'Home Decor',
    hobbyLeisure: 'Hobby & Leisure',

  };


  const handleNavigateCategory = (category, subCategory) => {
    navigate('/product', {
      state: {
        category: category,
        subCategory: subCategory
      }
    });
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleButtonClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const handleRegister = () => {
    // Implement register logic here
    console.log('Navigating to register page');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/home" className="logo-link">
          <img src={logo} alt="Logo" className="logo" />
        </Link>


      </div>

      <div className={`menu ${menuOpen ? 'open' : ''}`}>

        {categoryTitles && Object.keys(categoryTitles).map((title) => (
          <div key={title} onClick={() => handleNavigateCategory(title, 'all')} className="menu-item">
            {categoryTitles[title]}
          </div>
        ))}
        <div onClick={() => navigate('/create')} className="menu-item">
          Create
        </div>

      </div>

      <div>
        {/* <Button variant="secondary" onClick={handleButtonClick}>
          Login
        </Button>
        {showLoginModal && (
          <LoginModal onClose={handleCloseModal} onRegister={handleRegister} />
        )} */}
        <AuthButton/>
      </div>

      <button className="menu-toggle" onClick={handleMenuToggle}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </nav>
  );
};

export default Navbar;