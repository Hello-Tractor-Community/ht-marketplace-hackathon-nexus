import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './Listings.scss'; // Import CSS file for styling
import { FaEye, FaSync, FaCopy, FaTrash } from 'react-icons/fa';
import { dashboardService } from '../../../../../services/api/dashboard';
import MetricsUser from './MetricsUser';
import MetricsListing from './MetricsListing';

import './Dashboard.scss';
const Dashboard = () => {
  return (     
        <div className="dashboard-container">
            <section>
                <h2 className="text-2xl font-bold mb-4">User Analytics</h2>
                <MetricsUser />
            </section>
            
            <section>
                <h2 className="text-2xl font-bold mb-4">Listing Analytics</h2>
                <MetricsListing />
            </section>
        </div>  
  );
};

export default Dashboard;