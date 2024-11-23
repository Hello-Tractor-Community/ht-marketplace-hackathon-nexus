
// src/features/seller/components/DashboardMetrics.js
const DashboardMetrics = () => {
    const { 
      companyStatus, 
      listingStats, 
      recentMessages 
    } = useSelector(state => state.seller);
  
    return (
      <div className="dashboard-metrics">
        <section className="verification-status">
          <h3>Verification Status</h3>
          {/* Company registration status */}
          <p>{companyStatus?.registrationStatus}</p>
        </section>
  
        <section className="listing-performance">
          <h3>Listing Performance</h3>
          {/* Listing metrics from model */}
          <div>
            <p>Total Sales: {listingStats?.totalSales}</p>
            <p>Total Views: {listingStats?.views}</p>
          </div>
        </section>
      </div>
    );
  };
  