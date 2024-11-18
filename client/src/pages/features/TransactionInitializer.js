import React, { useState } from 'react';


const production = process.env.NODE_ENV === 'production';
const REACT_APP_API_URL = production ? process.env.REACT_APP_API_URL_PROD : process.env.REACT_APP_API_URL_DEV;



const TransactionInitializer = () => {
    console.log('REACT_APP_API_URL..',REACT_APP_API_URL);
    const [message, setMessage] = useState('');

    const initializeTransaction = async () => {
        console.log('Initializing transaction...');
        setMessage('Initializing transaction...');
        try {
            const response = await fetch(`${REACT_APP_API_URL}/transaction/initialize`, {
              
                
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
                // No need to include a body if the backend doesn't require it
            });

            console.log('Response:', response);

            const data = await response.json();
            if (response.ok) {
                setMessage('Transaction initialized successfully. Redirecting to payment page...');
                
                localStorage.setItem('currentTransaction', data.tx_ref);
                window.location.href = data.checkout_url;
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setMessage('An error occurred while initializing the transaction.');
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Chapa test mode</h1>
            <button onClick={initializeTransaction}>Initialize Transaction</button>
            <p>{message}</p>
        </div>
    );
};

export default TransactionInitializer;
