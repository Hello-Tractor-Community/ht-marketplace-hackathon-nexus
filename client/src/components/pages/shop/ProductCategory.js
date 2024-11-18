import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StarRating from './StarRating';

import './ProductCategory.css';

const ProductCategory = ({ title, data }) => {
  const navigate = useNavigate();
  const categoryTitles = {
    fashion: 'Fashion',
    homeDecor: 'Home Decor',
    hobbyLeisure: 'Hobby & Leisure',
  };

  const handleNavigateCategory = (category, subCategory) => {
    navigate('/product', { 
      state: { 
        category: category,
        subCategory: subCategory
      }
    });
  };

  const handleNavigateItem = (item) => { 

    // console.log('item in product category', item);
              
    navigate('/productDetail', { 
      state: {

        item:item,
      }
      
      
    });
  };

  return (
    <div className="product-category">
     <div onClick={() => handleNavigateCategory(title, 'all')} className="category-title">
        {categoryTitles[title]}
      </div>
      <div className="product-scroll">
        {Object.keys(data).map((subCategoryKey) =>
          Array.isArray(data[subCategoryKey]) &&
          data[subCategoryKey].map((item) => (
            item.images && item.name && item.rating !== undefined && item.price !== undefined && (
              <div 
              key={item.id} 
              onClick={() => handleNavigateItem(item)} 
              className="product-item"
            >
              <img src={item.images[0].source} alt={item.name} className="product-image" />
              <p className="product-name">{item.name}</p>
              <StarRating rating={item.rating} />
              <p className="product-price">{item.price} {item.priceUnit}</p>
            </div>
            )
          ))
        )}
      </div>
    </div>
  );
};

export default ProductCategory;