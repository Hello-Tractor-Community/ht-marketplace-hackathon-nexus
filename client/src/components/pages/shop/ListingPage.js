// ListingPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingService } from '../../../services/api/listing';
import StarRating from './StarRating';
import { Filter, Search } from 'lucide-react';
import Input from '../../common/input/Input';
import Button from '../../common/button/Button';
import placeholder_img from '../../../assets/images/tructors/placeholder.png';

import './ListingPage.scss';

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

  useEffect(() => {
    console.log("listings..", listings);

  }, [listings]);

  return (
    <div className="listings">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Second Hand Tractors</h1>

        {/* Search Bar */}
        <div className="search-bar-container">
          <Input
            type="text"
            placeholder="Search by name, make, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}

          />
          <Button
            onClick={handleSearch}
            variant='secondary'
          >
            <Search className="w-4 h-4" />
            Search
          </Button>

        </div>
      </div>

      <div className="main-container">
        {/* Filters Section */}
        <div className='listing-control'>
          <div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant='mini'
            >
              <Filter />
            </Button>
          </div>

          <div className={`${showFilters ? 'block' : 'hidden'} filters-container`}>
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
        </div>


        {/* Listings Grid */}
        <div className="listings-container">
          {isLoading && (
            <p>Loading..</p>
          )}

          {error && (
            <div style={{ color: 'red' }}>
              {error}
            </div>
          )}

          <div className="cards-container">
            {listings && listings.map(listing => (
              <div key={listing._id} className="card"
              onClick={() => navigate(`/listing/${listing._id}`)}>
                <img 
                  src={listing?.images[0].url || placeholder_img}
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
                  <Button
                    variant='secondary'
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent button click from triggering the div click
                      navigate(`/listing/${listing._id}`);
                    }}
                  >
                    See More
                  </Button>
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