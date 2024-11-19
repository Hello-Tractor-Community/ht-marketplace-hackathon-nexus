import React, { useState } from 'react';

const SearchForm = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        event.preventDefault(); 
        setSearchTerm(event.target.value);
    };

    return (
        <form className="search-form" onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <button type="submit">Search</button>
        </form>
    );
};  

export default SearchForm;