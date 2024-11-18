// File path: src/components/Search.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Search.scss';

const Search = ({ data }) => {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (text) => {
    setQuery(text);
    if (text) {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  };

  const handleNavigateItem = (item) => {
    navigate(`/product-detail/${item.id}`, { state: { item } });
  };

  return (
    <div className='searchContainer'>
           <input
        className='searchBar'
        placeholder="Search products here."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
     
    </div>
  );
};

export default Search;
