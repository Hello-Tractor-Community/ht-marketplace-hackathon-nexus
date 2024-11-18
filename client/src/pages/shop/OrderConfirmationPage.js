import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../features/AppContext';
import { useNavigate } from 'react-router-dom';
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';
import CartItem from '../../components/CartItem';
import NavBar from '../../common/navbar/NavBar';
import axios from 'axios';

const production = process.env.NODE_ENV === 'production';
const REACT_APP_API_URL = production ? process.env.REACT_APP_API_URL_PROD : process.env.REACT_APP_API_URL_DEV;
const OrderConfirmationPage = () => {
    const { clearCart } = useContext(AppContext);
    const navigate = useNavigate();
    const [transactionStatus, setTransactionStatus] = useState('pending');
    const txRef = localStorage.getItem('currentTransaction');

    // Telegram Mini App specific
    const tgApp = window.Telegram.WebApp;
    useEffect(() => {
        const verifyTransaction = async () => {
            try {
                const response = await axios.get(`/transaction/verify-transaction/${txRef}`);
                if (response.data.status === 'success') {
                    setTransactionStatus('success');
                } else {
                    setTransactionStatus('failed');
                }
            } catch (error) {
                console.error('Error verifying transaction:', error);
                setTransactionStatus('failed');
            }
        };

        if (txRef) {
            verifyTransaction();
        }
    }, [txRef]);

    const handleContinueShopping = () => {
        localStorage.removeItem('currentTransaction');
        clearCart();
        tgApp.openTelegramLink(`${REACT_APP_API_URL}/product?category=fashion&subcategory=all`);
        // navigate('/product', { state: { category: 'fashion', subcategory: 'all' } });
    };

    return (
        <div style={styles.mainContainer}>
            <NavBar />
            <CartItem />
            <div style={styles.container}>
                {transactionStatus === 'success' ? (
                    <IoCheckmarkCircleOutline size={80} color="#75A358" />
                ) : (
                    <IoCloseCircleOutline size={80} color="#FF6347" />
                )}
                <h2 style={styles.title}>
                    {transactionStatus === 'success' 
                        ? 'Thank You for Your Purchase!' 
                        : 'Transaction Status'}
                </h2>
                <p style={styles.orderNumber}>Order Number: {txRef}</p>
                <p style={styles.message}>
                    {transactionStatus === 'success' 
                        ? "Your order has been successfully placed. We'll send you an email with the order details and tracking information once your item(s) have been shipped."
                        : transactionStatus === 'failed'
                        ? "We're sorry, but there was an issue with your transaction. Please try again or contact customer support."
                        : "We're verifying your transaction. Please wait a moment..."}
                </p>
                <button style={styles.button} onClick={handleContinueShopping}>
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

const styles = {
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
    },
    title: {
        fontSize: '24px',
        fontFamily: 'Oswald, sans-serif',
        margin: '20px 0',
        textAlign: 'center',
    },
    orderNumber: {
        fontSize: '18px',
        marginBottom: '20px',
    },
    message: {
        fontSize: '16px',
        textAlign: 'center',
        marginBottom: '30px',
    },
    button: {
        backgroundColor: '#75A358',
        padding: '15px',
        borderRadius: '5px',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
};

export default OrderConfirmationPage;
