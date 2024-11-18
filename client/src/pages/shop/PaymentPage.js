import React, { useContext, useState, useEffect } from 'react';

import { AppContext } from '../features/AppContext';
import { useNavigate } from 'react-router-dom';

import NavBar from '../../common/navbar/NavBar';
import CartItem from '../../components/CartItem';

import ErrorModal from '../../components/ErrorModal';
import './PaymentPage.scss';

const production = process.env.NODE_ENV === 'production';
const REACT_APP_API_URL = production ? process.env.REACT_APP_API_URL_PROD : process.env.REACT_APP_API_URL_DEV;

const PaymentPage = () => {
    const { cartItems, calculateTotalItems, calculateSubtotal, clearCart, txRef, setTxRef } = useContext(AppContext);

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [message, setMessage] = useState('');

    // Telegram Mini App specific
    const tgApp = window.Telegram.WebApp;

    const paymentMethods = [
        { id: 'chapa', name: 'Chapa', icon: require('../../assets/images/paymentSystems/chapa.png') },
        { id: 'telebirr', name: 'Telebirr', icon: require('../../assets/images/paymentSystems/teleBirr.png') },
        { id: 'cbebirr', name: 'CBE birr', icon: require('../../assets/images/paymentSystems/cbeBirr.png') },
    ];

    const handlePaymentMethodSelect = (methodId) => {
        setSelectedPaymentMethod(methodId);
    };

    const handlePayNow = () => {
        if (!selectedPaymentMethod) {
            setErrorMessage('Please select a payment method');
            setErrorModalVisible(true);
            return;
        }
        initializeTransaction();
    };

    // At the top of your component file
    const getMockupChatId = () => {
        // Check if we're in a development environment
        if (process.env.NODE_ENV === 'development') {
            // Generate a random 9-digit number
            return Math.floor(100000000 + Math.random() * 900000000);
        }
        return null;
    };


    const initializeTransaction = async () => {
        setMessage('Initializing transaction...');
        try {
            const response = await fetch(`${REACT_APP_API_URL}/transaction/initialize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chatId: tgApp.initDataUnsafe?.user?.id || getMockupChatId()
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Transaction initialized successfully. Redirecting to payment page...');
                localStorage.setItem('currentTransaction', data.tx_ref);

                // Open the Chapa checkout URL in an iframe or new window
                tgApp.openTelegramLink(data.checkout_url);
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setMessage('An error occurred while initializing the transaction.');
            console.error('Error:', error);
        }
    };

    const closeErrorModal = () => {
        setErrorModalVisible(false);

    };



    return (
        <div className='mainContainer'>
            <NavBar />
            <CartItem />
            {/* <div style={styles.headerContainer}>
                <button onClick={() => navigate(-1)} style={styles.backButton}>
                    <IoArrowBack size={24} color="#75A358" />
                </button>
                <BreadCrumb items={breadcrumbItems} />
            </div> */}
            <h2 className='title'>Payment</h2>
            <div className='container'>


                <div className='paymentMethodsContainer'>
                    {paymentMethods.map((method) => (

                        <button
                            key={method.id}
                            className={`paymentMethodButton ${selectedPaymentMethod === method.id ? 'selectedPaymentMethod' : ''}`}

                            onClick={() => handlePaymentMethodSelect(method.id)}
                        >
                            <img src={method.icon} alt={method.name}
                                className='paymentIcon' />
                        </button>

                    ))}
                </div>

                <div
                    className='ctaPayContainer'>
                    <div
                        className='orderSummaryContainer'>
                        <h3
                            className='orderSummaryTitle'>Order Summary</h3>
                        {cartItems.map((item) => (
                            <div key={item.id}
                                className='orderItem'>
                                <span
                                    className='orderItemName'>{item.name}</span>
                                <span
                                    className='orderItemQuantity'>x{item.quantity}</span>
                                <span
                                    className='orderItemPrice'>ETB {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div
                            className='totalContainer'>
                            <span
                                className='totalText'>Total ({calculateTotalItems()} items):</span>
                            <span
                                className='totalAmount'>ETB {calculateSubtotal()}</span>
                        </div>
                    </div>

                    <button
                        className='payNowButton'
                        onClick={handlePayNow}>
                        Pay Now
                    </button>

                </div>


            </div>
            <ErrorModal
                visible={errorModalVisible}
                onClose={closeErrorModal}
                message={errorMessage}
            />

            {message && <p className='message-transaction'>{message}</p>}
        </div>
    );
};

export default PaymentPage;
