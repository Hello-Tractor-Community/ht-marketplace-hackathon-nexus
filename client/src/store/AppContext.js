// src/context/AppContext.js

import React, { createContext, useState } from 'react';

export const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [userLogged, setUserLogged] = useState(true);
    const [upsellShown, setUpsellShown] = useState(false);
    const [txRef, setTxRef] = useState('');
    const [defaultAddress, setDefaultAddress] = useState({
        name: 'Bruk',
        phoneNumber: '0911123456',
        email: 'bruk@gmail.com',
        streetAdress: 'Merkato menged',
        city: 'Addis Ababa',
        state: 'Addis Ababa',
        country: 'Ethiopia',
    });

    const addToCart = (item) => {
        const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
          setCartItems(cartItems.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ));
        } else {
          setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }

        console.log('cartItems', cartItems);
      };

    const removeFromCart = (itemId) => {
        const updatedCart = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedCart);
    };

    const handleQuantityChange = (itemId, delta) => {
        const updatedCartItems = cartItems.map(cartItem =>
            cartItem.id === itemId
                ? { ...cartItem, quantity: Math.max(1, cartItem.quantity + delta) }
                : cartItem
        );
        setCartItems(updatedCartItems);
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const calculateTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <AppContext.Provider value={{ cartItems, addToCart, removeFromCart, handleQuantityChange, 
            upsellShown, setUpsellShown,txRef, setTxRef,
            userLogged, setUserLogged, defaultAddress, setDefaultAddress, clearCart, calculateSubtotal, calculateTotalItems }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
