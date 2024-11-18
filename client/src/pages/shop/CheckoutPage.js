import React, { useContext } from 'react';
import { AppContext } from '../features/AppContext';

const CheckoutPage = ({ history }) => {
    const { cartItems } = useContext(AppContext);

    return (
        <div style={styles.container}>
            <h2>Checkout Screen</h2>
            {/* Display cart items */}
            {cartItems.map(item => (
                <p key={item.id}>{item.name}</p>
            ))}
            <button onClick={() => history.goBack()}>Go Back to Cart</button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
};

export default CheckoutPage;
