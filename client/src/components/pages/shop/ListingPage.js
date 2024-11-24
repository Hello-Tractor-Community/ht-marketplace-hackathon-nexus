// ListingPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingService } from '../../../services/api/listing';
import StarRating  from './StarRating';
import { Filter, Search } from 'lucide-react';

const ListingPage = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
  
    const [filters, setFilters] = useState({
      name: '',
      category: '',
      make: '',
      model: '',
      serviceHours: '',
      minPrice: 0,
      maxPrice: 100000,
      location: '',
      isFeatured: false,
      isNewArrival: false
    });
  
    const [searchTerm, setSearchTerm] = useState('');
  
    useEffect(() => {
      fetchListings();
    }, []);
  
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const response = await listingService.getListings({
          status: 'active'
        });
        const activeListings = response.data.filter(listing => 
          listing.inventory.quantity > 0
        );
        setListings(activeListings);
      } catch (err) {
        setError('Failed to fetch listings');
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleSearch = async () => {
      try {
        setIsLoading(true);
        const response = await listingService.searchListings({
          q: searchTerm,
          ...filters
        });
        const activeListings = response.data.filter(listing => 
          listing.inventory.quantity > 0
        );
        setListings(activeListings);
      } catch (err) {
        setError('Search failed');
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleFilterChange = (key, value) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    };

    useEffect(()=>{
      console.log("listings..",listings);

    }, [listings]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Second Hand Tractors</h1>
        
        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by name, make, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded"
          />
          <button 
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden px-4 py-2 border rounded flex items-center"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Section */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 space-y-4`}>
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Make</label>
                <input
                  type="text"
                  value={filters.make}
                  onChange={(e) => handleFilterChange('make', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <input
                  type="text"
                  value={filters.model}
                  onChange={(e) => handleFilterChange('model', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price Range</label>
                <div className="mt-2">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2 text-sm">
                    <span>${filters.minPrice}</span>
                    <span>${filters.maxPrice}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isFeatured}
                    onChange={(e) => handleFilterChange('isFeatured', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2">Featured Only</span>
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isNewArrival}
                    onChange={(e) => handleFilterChange('isNewArrival', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2">New Arrivals</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="flex-1">
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center p-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings && listings.map(listing => (
              <div key={listing._id} className="border rounded-lg overflow-hidden">
                <img
                  src={listing.images[0] || "/api/placeholder/400/300"}
                  alt={listing.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{listing.name}</h3>
                  <div className="flex items-center mb-2">
                    <StarRating rating={listing.metrics?.averageRating || 4.5} />
                    <span className="ml-2 text-sm text-gray-600">
                      ({listing.metrics?.totalReviews || 0} reviews)
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{listing.make} {listing.model}</p>
                  <p className="font-semibold mb-2">${listing.price?.amount}</p>
                  <p className="text-sm text-gray-500 mb-4">{listing.location?.city}, {listing.location?.state}, {listing.location?.country}</p>
                  <button 
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => navigate(`/listing/${listing._id}`)}
                  >
                    See More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;