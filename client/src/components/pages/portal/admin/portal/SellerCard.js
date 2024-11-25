import React from "react";
import { FaCheck, FaTimes, FaMapMarkerAlt } from "react-icons/fa";
import Button from '../../../../common/button/Button';

import "./SellerCard.scss";


const SellerCard = ({ seller, handleApprove, closeOverlay, handleReject }) => {
 
  
  return (
    <div className="card-overview"
    >
      <Button variant="mini"
        onClick={closeOverlay}
        className="close">
        <FaTimes />
      </Button>
      <div className="card-header">
        <h3>{seller.firsName} {seller.lastName}</h3>
       </div> 

      <div className="card-body">
        <div className="card-details">

          <p><strong>Account status:</strong> {seller.accountStatus}</p>
          <p><strong>Company associations:</strong> {seller.companyAssociations}</p>
          <p><strong>Phone Verified:</strong> {seller?.phone?.isVerified ? "Yes":"No"}</p>
          <p><strong>Email:</strong> {seller?.email}</p>
         


        </div>
      </div>
      <div className="card-footer">
     
        <Button className="approve" variant="primary" onClick={() => handleApprove(seller._id)}>
          <FaCheck /> Approve
        </Button>
      
        <Button  className="reject" variant="secondary" onClick={() => handleReject(seller._id)}>
          <FaTimes /> Reject
        </Button>
      </div>
    </div>
  );
};

export default SellerCard;
