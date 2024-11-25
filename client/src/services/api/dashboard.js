// services/api/dashboard.js
import api from './config';

export const dashboardService = {
    getUserMetrics: async () => {
        try {
            const response = await api.get('/dashboard/metrics/users');
            console.log("user metrics response..", response);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    },

    getListingMetrics: async () => {
        try {
            const response = await api.get('/dashboard/metrics/listings');
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    },

    // Get combined dashboard data
    getDashboardOverview: async () => {
        try {
            const [userMetrics, listingMetrics] = await Promise.all([
                api.get('/dashboard/metrics/users'),
                api.get('/dashboard/metrics/listings')
            ]);

            return {
                success: true,
                data: {
                    users: userMetrics.data.data,
                    listings: listingMetrics.data.data
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }
};