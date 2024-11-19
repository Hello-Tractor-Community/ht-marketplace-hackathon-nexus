import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';


import NavBar from '../../common/navigation/NavBar';
import CartItem from './CartItem';
import StarRating from './StarRating';
import QuantityErrorModal from './QuantityErrorModal';
import { AppContext } from '../../../store/AppContext';
import mockData from '../../../assets/mockData';

import './ProductDetailPage.scss';

const ProductDetailPage = () => {
    const location = useLocation();
    const item = location.state.item || {};
  const [quantityError, setQuantityError] = useState(false);
  const [allQuantitiesValid, setAllQuantitiesValid] = useState(true);
  const [customQuantities, setCustomQuantities] = useState({});
  const navigate = useNavigate();
  const { addToCart, upsellShown, cartItems } = useContext(AppContext);

  console.log('item..',item)
  const [currentImage, setCurrentImage] = useState(item.images[0].source);
//   const [currentImage, setCurrentImage] = useState('');

  const [foundFeaturedItem, setFoundFeaturedItem] = useState(null);

  const findFeaturedItem = (data) => {
    for (const category in data) {
        if (data.hasOwnProperty(category)) {
          const subCategories = data[category];
          for (const subCategory in subCategories) {
            if (subCategories.hasOwnProperty(subCategory)) {
              const items = subCategories[subCategory];
              if (Array.isArray(items)) {
                for (const item of items) {
                  if (item.isFeatured) {
                    return item;
                  }
                }
              }
            }
          }
        }
      }
      return null;
  };

  useEffect(() => {
    if (!upsellShown) {
      setFoundFeaturedItem(findFeaturedItem(mockData));
    }
    console.log("In ProductDetailPage page.");
  }, []);

  const validateAllQuantities = () => {
    const tempQuantities = {}; // Initialize tempQuantities as an empty object

    if (cartItems.length === 0) {
      setAllQuantitiesValid(false);
      return false;
    }

    const allValid = cartItems.every(item => {
      const quantity = customQuantities[item.id]
        ? parseInt(tempQuantities[item.id], 10)
        : item.quantity;
      return !isNaN(quantity) && quantity > 0;
    });
    setAllQuantitiesValid(allValid);
    return allValid;
  };

  const closeErrorModal = () => {
    setQuantityError(false);
    validateAllQuantities();
  };

  const handleProceedToCheckout = () => {
    if (validateAllQuantities()) {
      upsellShown ? navigate('/cart') : navigate('/upsell', { state: { item: foundFeaturedItem } });
    } else {
      setQuantityError(true);
    }
  };

  return (
    <div className="main-container">
      <NavBar />
      <CartItem />

      {item && (
        <div className="product-container">
          <div className="image-container">
            <div className="main-image-container">
              <img src={currentImage} alt={item.name} className="main-image" />
            </div>
            <div className="smaller-images-container">
              {item.images.map((img, index) => (
                <img
                  key={index}
                  src={img.source}
                  alt={`${item.name} ${index + 1}`}
                  className="smaller-image"
                  onClick={() => setCurrentImage(img.source)}
                />
              ))}
            </div>
          </div>

          <div className="info-container">
            <h2 className="name">{item.name}</h2>
            <p className="description">{item.description}</p>
            <p className="price">{item.priceUnit} {item.price.toFixed(2)}</p>
            <p className="rating">
              Rating: {item.rating} ({item.reviews} reviews)
              <StarRating rating={item.rating} />
            </p>
          </div>

          <div className="cta-container">
            <button className="button add-to-cart" onClick={() => addToCart(item)}>
              Add to Cart
            </button>
            <button className="button checkout" onClick={handleProceedToCheckout}>
              Proceed to Checkout
            </button>
            <button className="button shop-more" onClick={() => navigate(-1)}>
              Shop for More
            </button>
          
          </div>
         
        </div>
      )}

      <QuantityErrorModal
        visible={quantityError}
        onClose={closeErrorModal}
        cartEmpty={cartItems.length === 0}
      />
    </div>
  );
};

export default ProductDetailPage;