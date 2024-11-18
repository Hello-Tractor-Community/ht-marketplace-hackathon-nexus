// client/src/components/Product.js
import React, { useState, useEffect } from 'react';
import './ProductTest.css';

const apiUrl = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL_PROD
  : process.env.REACT_APP_API_URL_DEV;


const imageBaseUrl = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL_PROD
  : process.env.REACT_APP_API_URL_DEV;

const ProductTest = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/products`)
      .then(response => response.json())
      .then(data => {
        const updatedProducts = data.map(product => ({
          ...product,
          imageUrl: `${imageBaseUrl}${product.imageUrl}`
        }));
        setProducts(updatedProducts);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    if (products) {
      console.log('Products:', products);
    }
  }, [products]);

  const RenderProducts = ({ name, price, description, imageUrl }) => {
    return (
      <div className="product">
        <img src={imageUrl} alt={name} />
        <h2>{name}</h2>
        <p>ETB {price}</p>
        <button>Add to Cart</button>
      </div>
    );
  };

 

  return (
    <>
     <h1>Welcome to nayeDesigns</h1>
     <div className="product-list">
     
     {products.map((product) => (
           <RenderProducts
             key={product.id}
             name={product.name}
             price={product.price}
             description={product.description}
             imageUrl={product.imageUrl}
           />
         ))}
   </div>
    </>
   
  );  
};


export default ProductTest;
