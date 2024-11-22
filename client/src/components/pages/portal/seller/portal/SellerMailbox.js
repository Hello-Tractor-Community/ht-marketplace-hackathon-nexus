import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './SellerListings.scss'; // Import CSS file for styling
import { FaEye, FaEyeSlash, FaCopy, FaTrash } from 'react-icons/fa';


const SellerMailbox = () => {

  const [searchResults, setSearchResults] = useState([]);
  const { user } = useSelector((state) => state.auth);
 
  return (
    < >

      <div className='sub-container'>
        <div className='seller-listing-controller'>
          <div className='seller-content-form'>
            <h3>Your Mailbox</h3>  
          </div>
        </div>

     </div>


    </>
  );
};

export default SellerMailbox;