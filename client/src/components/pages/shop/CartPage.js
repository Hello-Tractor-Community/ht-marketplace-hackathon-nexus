import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../features/AppContext';

import NavBar from '../../common/navbar/NavBar';
import CartItem from '../../components/CartItem';
import { useNavigate } from 'react-router-dom';
import QuantityErrorModal from '../../components/QuantityErrorModal';

import './CartPage.scss';

const CartPage = () => {
  const { cartItems, handleQuantityChange, calculateSubtotal, calculateTotalItems, removeFromCart, upsellShown } = useContext(AppContext);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [customQuantities, setCustomQuantities] = useState({});
  const [tempQuantities, setTempQuantities] = useState({});
  const [quantityError, setQuantityError] = useState(false);
  const [allQuantitiesValid, setAllQuantitiesValid] = useState(true);
  const [inputBackgroundColors, setInputBackgroundColors] = useState({});

  const handleQuantitySelect = (itemId, value) => {
    if (value === 'custom') {
      setCustomQuantities({ ...customQuantities, [itemId]: true });
      setTempQuantities({ ...tempQuantities, [itemId]: cartItems.find(item => item.id === itemId).quantity.toString() });
    } else {
      handleQuantityChange(itemId, value - cartItems.find(item => item.id === itemId).quantity);
    }
  };

  const handleCustomQuantityChange = (itemId, value) => {
    setTempQuantities({ ...tempQuantities, [itemId]: value });
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue <= 0) {
      setInputBackgroundColors({ ...inputBackgroundColors, [itemId]: 'red' });
    } else {
      setInputBackgroundColors({ ...inputBackgroundColors, [itemId]: 'transparent' });
    }
  };

  const validateAllQuantities = () => {
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

  const handleUpdateQuantity = (itemId) => {
    const numValue = parseInt(tempQuantities[itemId], 10);
    if (!isNaN(numValue) && numValue > 0) {
      handleQuantityChange(itemId, numValue - cartItems.find(item => item.id === itemId).quantity);
      setCustomQuantities({ ...customQuantities, [itemId]: false });
      validateAllQuantities();
    } else {
      setQuantityError(true);
      setErrorMessage('Please enter a valid positive number for the quantity of your items.')
    }
  };

  const closeErrorModal = () => {
    setQuantityError(false);
    setErrorMessage('')
    validateAllQuantities();
  };

  const renderQuantityControl = (item) => {
    if (customQuantities[item.id]) {
      return (
        <div className="custom-quantity-container">
          <input
            className="custom-quantity-input"
            style={{ backgroundColor: inputBackgroundColors[item.id] || 'transparent' }}
            value={tempQuantities[item.id]}
            onChange={(e) => handleCustomQuantityChange(item.id, e.target.value)}
            type="number"
          />
          <button
            className="update-button"
            onClick={() => handleUpdateQuantity(item.id)}
          >
            Update
          </button>
        </div>
      );
    }



    return (
      <div className="quantity-control-container">
        <select
          value={item.quantity > 10 ? 'custom' : item.quantity}
          onChange={(e) => handleQuantitySelect(item.id, parseInt(e.target.value, 10))}
          className="quantity-select"
        >
          {[...Array(10).keys()].map(i => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
          <option value="custom">{item.quantity > 10 ? item.quantity.toString() : "10+"}</option>
        </select>
        <button
          className="delete-button"
          onClick={() => removeFromCart(item.id)}
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    );
  };

  const handleProceedToCheckout = () => {
    if (validateAllQuantities()) {
      navigate('/shipping');
    } else {
      setQuantityError(true);
    }
  };


  return (
    <div className="cart-screen">
      <NavBar />
      <CartItem />
      {/* <div className="header-container">
        <button onClick={() => navigate(-1)} className="back-button">
          <i className="fas fa-arrow-left"></i>
        </button>
        <BreadCrumb items={breadcrumbItems} />
      </div> */}
      <h1 className="title">Your shopping cart</h1>
      {cartItems && (
        <div className="cart-container">
        

          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-info">
                <div className="image-container">
                  <img src={item.images[0].source} alt={item.name} className="item-image" />
                </div>

                <div className="info-container">
                  <h2 className="item-name">{item.name}</h2>
                  <p className="item-description">{item.description}</p>
                  <div className="quantity-container">
                    {renderQuantityControl(item)}
                  </div>
                </div>

                <div className="price-container">
                  <p className="item-price">{item.priceUnit} {item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}

            {cartItems.length >= 1 && (
              <>
                <div className="subtotal">
                  <p className="subtotal-text">
                    Subtotal ({calculateTotalItems()} items):
                  </p>
                  <p className="subtotal-price">ETB {calculateSubtotal()}</p>
                </div>

              </>
            )}
          </div>

          {
            cartItems.length>=1 && (
              <div className="cta-container">
            <button
              className={`checkout-button ${!allQuantitiesValid ? 'disabled' : ''}`}
              onClick={handleProceedToCheckout}
              disabled={!allQuantitiesValid}
            >
              Proceed to Checkout
            </button>
          </div>
            )
          }
        </div>
      )}

      {cartItems.length === 0 && (
        <div className="no-results-container">
          <p className="no-results-text">You have no items in Cart.</p>
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

export default CartPage;