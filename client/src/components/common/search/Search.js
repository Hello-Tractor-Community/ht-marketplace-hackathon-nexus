// src/components/common/Search/Search.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchForm from './SearchForm';
import Card from '../card/Card';

import './Search.scss';

const Search = () => {
  const dispatch = useDispatch();
  const { items: institutes, loading, error } = useSelector(state => state.institutes);
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
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        
        <div className="search-results">
          {institutes.map(institute => (
            <Card key={institute._id} className="institute-card">
              <h2>{institute.name}</h2>
              <p>{institute.type}</p>
              <p>{institute.description}</p>
              <div className="institute-card__footer">
                <button 
                  className="btn btn--secondary"
                  onClick={() => window.location.href = `/institute/${institute._id}`}
                >
                  View Details
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

