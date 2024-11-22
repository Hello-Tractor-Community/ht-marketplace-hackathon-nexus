import React from 'react';
import { replace, useNavigate } from 'react-router-dom';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import CartItem from '../shop/CartItem';
import NavBar from '../../common/navigation/NavBar';

const ErrorPage = () => {
 
    const navigate = useNavigate();  
   

   const handleContinueShopping = () => {
        
        navigate('/home', { replace: true });
    };


    return (
        <div style={styles.mainContainer}>
            <NavBar />
            <CartItem />
            <div style={styles.container}>
            <IoCheckmarkCircleOutline size={80} color="#75A358" />
                <p style={styles.message}>
                    <b>Oops! the page you are looking for does not exist.</b>
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

export default ErrorPage;
