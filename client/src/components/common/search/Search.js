// src/pages/public/Search/Search.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchForm from '../../../components/features/search/SearchForm';
import Card from '../../../components/common/card/Card';
import { searchInstitutes } from '../../../store/slices/InstituteSlice';
import './Search.scss';

const Search = () => {
  const dispatch = useDispatch();
  const { items: institutes, loading, error } = useSelector(state => state.institutes);
  const [filters, setFilters] = useState({
    type: '',
    location: ''
  });

  const handleSearch = (searchTerm) => {
    dispatch(searchInstitutes({ searchTerm, ...filters }));
  };

  return (
    <div className="search-page">
      <div className="search-page__header">
        <h1>Find Educational Institutes</h1>
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

