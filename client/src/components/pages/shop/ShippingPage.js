import React, { useContext, useState } from 'react';
import { AppContext } from '../features/AppContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../common/navbar/NavBar';
import CartItem from '../../components/CartItem';
import BreadCrumb from '../../components/BreadCrumb';
import ErrorModal from '../../components/ErrorModal';
import RadioButton from '../../components/RadioButton';
import './ShippingPage.scss';


const ShippingPage = () => {
    const { userLogged, defaultAddress, calculateTotalItems, calculateSubtotal } = useContext(AppContext);
    const navigate = useNavigate();
    const breadcrumbItems = ['Home', 'Cart', 'Shipping'];

    const [useDefaultAddress, setUseDefaultAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        streetAddress: '',
        city: ''
    });

    const [errorModalVisible, setErrorModalVisible] = useState(false);

    const handleInputChange = (field, value) => {
        setNewAddress({ ...newAddress, [field]: value });
    };

    const validateForm = () => {
        if (userLogged && useDefaultAddress) return true;
        return Object.values(newAddress).every(value => value.trim() !== '');
    };

    const handleContinue = () => {
        if (validateForm()) {
            navigate('/payment');
        } else {
            setErrorModalVisible(true);
        }
    };

    const closeErrorModal = () => {
        setErrorModalVisible(false);
    };

    const toggleDefaultAddress = () => {
        setUseDefaultAddress(prevState => !prevState);
    };

    return (
        <div className="shipping-screen">
            <NavBar />
            <CartItem />
            {/* <div className="header-container">
                <button onClick={() => navigate(-1)} className="back-button">
                    <i className="ionicon ionicon-arrow-back"></i>
                </button>
                <BreadCrumb items={breadcrumbItems} />
            </div> */}

            <div className="container">
                <h1 className="title">Shipping Information</h1>

                <div className='address-container'>
                    {userLogged && (
                        <div className="registered-address-container">
                            <RadioButton
                                label="Use registered address"
                                selected={useDefaultAddress}
                                onToggle={toggleDefaultAddress}
                            />
                            <div className="default-address-text">
                                <h2 className="default-address-title">Registered address</h2>
                                <p>{defaultAddress.name}</p>
                                <p>{defaultAddress.streetAddress}</p>
                                <p>{defaultAddress.city}</p>
                                <p>{defaultAddress.phoneNumber}</p>
                                <p>{defaultAddress.email}</p>
                            </div>
                        </div>
                    )}

                    {(!userLogged || !useDefaultAddress) && (
                        <div className="form-container">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={newAddress.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Street Address"
                                value={newAddress.streetAddress}
                                onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="City"
                                value={newAddress.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={newAddress.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newAddress.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                        </div>
                    )}

                </div>

                <div className='cta-shipping'>
                    <div className="summary-container">
                        <p className="summary-text">
                            Total Items: <span>{calculateTotalItems()}</span>
                        </p>
                        <p className="summary-text">
                            Subtotal: <span>ETB {calculateSubtotal()}</span>
                        </p>
                    </div>
                    <div className="button-container">

                        <button
                            className="button-continue"
                            onClick={handleContinue}
                        >
                            Continue to Payment
                        </button>
                    </div>

                </div>


            </div>
            <ErrorModal
                visible={errorModalVisible}
                onClose={closeErrorModal}
                message="Please fill in all required fields."
            />
        </div>
    );
};

export default ShippingPage;