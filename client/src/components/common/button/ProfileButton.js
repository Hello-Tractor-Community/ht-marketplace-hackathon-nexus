import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import Button from './Button';
import { logout } from '../../../store/slices/authSlice';

const ProfileButton = () => {
  const businessDetails = useSelector((state) => state.auth.businessDetails);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, user, authLoading } = useSelector((state) => state.auth);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/home');
  };

  useEffect(()=>{

    console.log("isAuthenticated..",isAuthenticated);

  },[])

  const getProfileLink = () => {
    const platformRole = user.platformRoles;
    console.log("profile navigation role..",platformRole);
    if(platformRole[0] === "seller"){
      // navigate('/seller/portal', {
      //   state: {
      //     companyDetails,
      //     verificationStatus: 'completed',
      //     user
      //   },
      //   replace: true
      // });
      navigate('/seller/portal')

    }

    else{
      // navigate('/buyer/portal',{
      //   state: {
      //     companyDetails,
      //     verificationStatus: 'completed',
      //     user
      //   },
      //   replace: true

      // })
      navigate('/buyer/portal');

    }
  };

   // Close dropdown when clicking outside
   useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="profilebtn-container"
    ref={dropdownRef} >


      <Button
        variant="primary"
        onClick={() => setShowDropdown((prev) => !prev)}
        
      >
        <FaUserCircle />
        {businessDetails ? 'Portal' : 'My Account'}
      </Button>
      {showDropdown && (
       
          <div className='__options'>
            <div>
            <a
              href="#"
              onClick={getProfileLink}
              
            >
              Profile
            </a>
            </div>
            <div>
            <Button
        variant="secondary"
        onClick={handleLogout}       
      >
        Logout
        </Button>
            </div>
          </div>
        
      )}
    </div>
  );
};

export default ProfileButton;
