import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import './ProductList.css';

const sectionTitles = {
  fashion: 'Fashion',
  homeDecor: 'Home Decor',
  hobbyLeisure: 'Hobby & Leisure',
};

const ProductList = ({ category, title, data }) => {
  const navigate = useNavigate();

  const handleNavigateCategory = (category, subCategory) => {
    navigate(`/product/${category}/${subCategory}`);
  };

  const handleNavigateItem = (item) => {                        
    navigate('/productDetail', { 
      state: {

        item:item,
      }       
      
    });
  };

  useEffect(() => {
     window.scrollTo(0, 0);  
 
    if(title !== 'all'){
      console.log('in productlist.');
      console.log('category',category);
      console.log('title', title);
      console.log('data', data);
      console.log('data tile..',data[category] )
      
      // console.log(data[title]);
    }
  }, [title]);

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
    <div className="category-container">
      <h2 className="category-title" onClick={() => handleNavigateCategory(title, 'all')}>
        {sectionTitles[title]}
      </h2>
      <div  >
      {title === 'all' && Object.keys(data).map((subCategoryKey) => (
        Array.isArray(data[subCategoryKey]) && (
          <>
         
          
            <h3 className="sub-category-title">{subCategoryKey}</h3>
            <div key={subCategoryKey} className='product-grid'>
              {data[subCategoryKey].map(renderItem)}
            
            </div>
            </>
        )
      ))}
     {title !== 'all' && !data[title] &&Object.keys(data).length > 0 && (
  Object.entries(data).map(([categoryKey, categoryItems]) => (
    <div key={categoryKey}>
        <>
        {Array.isArray(categoryItems) ? (
          categoryItems.map(renderItem)
        ) : (
          Object.entries(categoryItems).map(([subCategoryKey, subCategoryItems]) => (
            
            
              <div className='product-grid'>
                {subCategoryItems.map(renderItem)}
              </div>
            
          ))
        )}
      </>
    </div>
  ))
)}
       {title !== 'all' && data[title] &&(
         
          <>
         <h3 className="sub-category-title">{title}</h3>
         <div key={title} className='product-grid'>
           {data[title].map(renderItem)}
         
         </div>
         </>
         
       )           
      
      }
      </div>
    </div>
  );
};

export default ProductList;
