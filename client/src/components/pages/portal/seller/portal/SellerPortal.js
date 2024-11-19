import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import UploadWidgetClaudinary from '../../../../features/storage/UploadWidgetClaudinary';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaCopy, FaTrash } from 'react-icons/fa';



// import bcrypt from 'bcryptjs'; // Import bcryptjs for hashing

import './seller_portal.scss'; // Import CSS file for styling

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
// const API_URL = 'https://api-netconn.brosfe.com';

const SellerPortal = () => {
  const navigate = useNavigate();  
  




  return (
    <div className='admin-dashboard'>

<h2>Seller Portal</h2>
     

    </div>


  );
};

export default SellerPortal;

