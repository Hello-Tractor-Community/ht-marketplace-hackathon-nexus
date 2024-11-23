import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/logo/logo.png';

import AuthButton from '../button/AuthButton';
import './NavBar.scss';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons
import { TreeDeciduous } from 'lucide-react';

const Navbar = ({ show = true }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);


  const categoryTitles = {
    tractor: 'Tractor',
    service: 'Service Centers',



  };


  const handleNavigateCategory = (category, subCategory) => {
    navigate('/listing', {
      state: {
        category: category,
        subCategory: subCategory
      }
    });
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <Link to="/home" className="logo-link">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>
      {show && (

        <div className={`menu ${menuOpen ? 'open' : ''}`}>

          {categoryTitles && Object.keys(categoryTitles).map((title) => (
            <div key={title} onClick={() => handleNavigateCategory(title, 'all')} className="menu-item">
              {categoryTitles[title]}
            </div>
          ))}

        </div>
      )}


      {show && (
        <div>
          <AuthButton />
        </div>
      )}


      <button className="menu-toggle" onClick={handleMenuToggle}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </div>
  );
};

export default Navbar;
