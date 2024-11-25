import React, { useEffect, useState } from 'react';

import { dashboardService } from '../../../../../services/api/dashboard';

const MetricsUser = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const result = await dashboardService.getUserMetrics();
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
        <div className="user-metrics">
            {/* Total Users Card */}
            <div className="p-4 bg-white rounded-lg shadow">
                <p className="text-lg font-semibold">Total Users</p>
                <h3 className="text-3xl font-bold">{metrics.total}</h3>
            </div>

            {/* Status Cards */}
            {Object.entries(metrics.byStatus).map(([status, count]) => (
                <div 
                    key={status}
                    className="p-4 bg-white rounded-lg shadow"
                >
                    <p className="text-lg font-semibold capitalize">
                        {status} Users
                    </p>
                    <h3 className="text-3xl font-bold">{count}</h3>
                </div>
            ))}

            {/* Recent Users Card */}
            <div className="p-4 bg-white rounded-lg shadow">
                <p className="text-lg font-semibold">New Users (30 days)</p>
                <h3 className="text-3xl font-bold">{metrics.recentUsers}</h3>
            </div>
        </div>
    );
};

export default MetricsUser;