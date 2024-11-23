import React from "react";
import { FaCheck, FaTimes, FaMapMarkerAlt } from "react-icons/fa";

import "./ListingCard.scss";

const ListingCard = ({ listing, handleApprove, closeOverlay, handleReject }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{listing.name}</h3>
        <p className="sku">SKU: {listing.sku}</p>
      </div>

      <div className="card-body">
        <div className="card-details">
          <p><strong>Category:</strong> {listing.category}</p>
          <p><strong>Price:</strong> {listing.price.currency} {listing.price.amount.toLocaleString()}</p>
          <p><strong>Make:</strong> {listing.make} | <strong>Model:</strong> {listing.model}</p>
          <p><strong>Service Hours:</strong> {listing.serviceHours} hrs</p>
          <p><strong>Inventory:</strong> {listing.inventory.quantity} units</p>
          <p><strong>Location:</strong> <FaMapMarkerAlt /> {`${listing.location.city}, ${listing.location.country}`}</p>
          <p><strong>Description:</strong> {listing.description.length > 50 ? `${listing.description.slice(0, 50)}...` : listing.description}</p>
        </div>
        
        <div className="card-stats">
          <p><strong>Metrics:</strong></p>
          <ul>
            <li>Total Sales: {listing.metrics.totalSales}</li>
            <li>Views: {listing.metrics.views}</li>
            <li>Rating: {listing.metrics.averageRating} ({listing.metrics.reviewCount} reviews)</li>
          </ul>
        </div>

        <div className="card-status">
          <p><strong>Status:</strong> {listing.status}</p>
          <p><strong>Created By:</strong> {`${listing.user.firstName} ${listing.user.lastName}`}</p>
        </div>
      </div>

      <div className="card-footer">
        <button className="approve-btn" onClick={() => handleApprove(listing._id)}>
          <FaCheck /> Approve
        </button>
        <button className="reject-btn" onClick={() => handleReject(listing._id)}>
          <FaTimes /> Reject
        </button>
      </div>
    </div>
  );
};

export default ListingCard;
