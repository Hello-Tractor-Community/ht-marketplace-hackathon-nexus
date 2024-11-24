// src/components/common/Search/Search.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchForm from './SearchForm';
import Card from '../card/Card';

import './Search.scss';

const Search = () => {
  const dispatch = useDispatch();
  // const { items: listings, loading, error } = useSelector(state => state.listings);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);


  const [filters, setFilters] = useState({
    type: '',
    location: ''
  });

  const handleSearch = (searchTerm) => {
    //dispatch here.
  };

  return (
    <div className="search-page">
      <div className="search-page__header">
        <h1>Find Second Hand Tractors</h1>
        <SearchForm onSearch={handleSearch} />
      </div>
      
      <div className="search-page__content">
        {isLoading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        
        <div className="search-results">
          {listings.map(listing => (
            <Card key={listing._id} className="listing-card">
              <h2>{listing.name}</h2>
              <p>{listing.type}</p>
              <p>{listing.description}</p>
              <div className="listing-card__footer">
                <button 
                  className="btn btn--secondary"
                  onClick={() => window.location.href = `/listing/${listing._id}`}
                >
                  See More
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;

