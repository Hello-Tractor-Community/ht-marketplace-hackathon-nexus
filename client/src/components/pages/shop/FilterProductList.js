import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import './ProductList.css';

const sectionTitles = {
  fashion: 'Fashion',
  homeDecor: 'Home Decor',
  hobbyLeisure: 'Hobby & Leisure',
};

const FilterableProductList = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredData, setFilteredData] = useState(data);
  const navigate = useNavigate();

  useEffect(() => {
    filterData();
  }, [selectedCategory, data]);

  const filterData = () => {
    if (selectedCategory === 'all') {
      setFilteredData(data);
    } else {
      const filtered = {};
      Object.keys(data).forEach(category => {
        if (category === selectedCategory) {
          filtered[category] = data[category];
        }
      });
      setFilteredData(filtered);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleNavigateItem = (item) => {
    navigate('/productDetail', { 
      state: {
        item: item,
      }
    });
  };

  const renderItem = (item) => (
    <div key={item.id} className="product-item" onClick={() => handleNavigateItem(item)}>
      <img src={item.images[0].source} alt={item.name} className="product-image" />
      <div className="product-info">
        <p className="product-name">{item.name}</p>
        <p className="product-price">{item.price} {item.priceUnit}</p>
        <p className="product-description">{item.description}</p>
        <StarRating rating={item.rating} />
      </div>
    </div>
  );

  return (
    <div className="filterable-product-list">
      <div className="category-buttons">
        <button onClick={() => handleCategorySelect('all')}>All</button>
        {Object.keys(data).map((category) => (
          <button key={category} onClick={() => handleCategorySelect(category)}>
            {sectionTitles[category] || category}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {Object.keys(filteredData).map((category) => (
          <div key={category}>
            <h2 className="category-title">{sectionTitles[category] || category}</h2>
            {Object.keys(filteredData[category]).map((subCategory) => (
              Array.isArray(filteredData[category][subCategory]) && (
                <div key={subCategory}>
                  <h3 className="sub-category-title">{subCategory}</h3>
                  <div className="product-list">
                    {filteredData[category][subCategory].map(renderItem)}
                  </div>
                </div>
              )
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterableProductList;