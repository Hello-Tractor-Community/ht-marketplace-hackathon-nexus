// src/features/seller/SellerPortal.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './components/Sidebar';
import DashboardMetrics from './components/DashboardMetrics';
import ListingManager from './components/ListingManager';
import CreateListingForm from './components/CreateListingForm';
import MessageCenter from './components/MessageCenter';
import { fetchSellerProfile, fetchListings, fetchMessages } from './sellerSlice';

const SellerPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const dispatch = useDispatch();
  const { user, listings, messages } = useSelector(state => state.seller);

  useEffect(() => {
    dispatch(fetchSellerProfile());
    dispatch(fetchListings());
    dispatch(fetchMessages());
  }, [dispatch]);

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardMetrics />;
      case 'listings':
        return <ListingManager />;
      case 'create-listing':
        return <CreateListingForm />;
      case 'messages':
        return <MessageCenter />;
      default:
        return <DashboardMetrics />;
    }
  };

  return (
    <div className="seller-portal">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        userProfile={user}
      />
      <main className="portal-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default SellerPortal;