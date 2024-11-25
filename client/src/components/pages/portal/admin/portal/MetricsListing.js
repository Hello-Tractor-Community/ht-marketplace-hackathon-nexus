// components/dashboard/ListingMetrics.jsx
import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../../../../services/api/dashboard';

const MetricsListing = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const result = await dashboardService.getListingMetrics();
                if (result.success) {
                    setMetrics(result.data);
                } else {
                    setError(result.error);
                }
            } catch (err) {
                setError('Failed to fetch metrics');
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) return <div>Loading metrics...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!metrics) return null;

    return (
        <div className="listing-metrics">
            {/* Status Overview */}
            <div className="group-1">
                {/* Total Listings Card */}
                <div className="p-4 bg-white rounded-lg shadow">
                    <p className="text-lg font-semibold">Total Listings</p>
                    <h3 className="text-3xl font-bold">{metrics.total}</h3>
                </div>

                {/* Status Cards */}
                {Object.entries(metrics.byStatus).map(([status, count]) => (
                    <div 
                        key={status}
                        className="p-4 bg-white rounded-lg shadow"
                    >
                        <p className="text-lg font-semibold capitalize">
                            {status} Listings
                        </p>
                        <h3 className="text-3xl font-bold">{count}</h3>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="">
                <div className="p-4 bg-white rounded-lg shadow">
                    <p className="text-lg font-semibold">New Listings (30 days)</p>
                    <h3 className="text-3xl font-bold">{metrics.recentListings}</h3>
                </div>
            </div>

        </div>
    );
};

export default MetricsListing;