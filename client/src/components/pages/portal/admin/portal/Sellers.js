import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './Sellers.scss'; // Import CSS file for styling
import {FaTrash, FaCheck, FaEllipsisV } from 'react-icons/fa';

import { authService } from '../../../../../services/api/auth';
import { userService } from '../../../../../services/api/user';
import SuccessOverlay from './SuccessOverlay';
import ErrorOverlay from './ErrorOverlay';
import Button from '../../../../common/button/Button';
import Input from '../../../../common/input/Input';

import ListingCard from './ListingCard';

const Sellers = () => {

    const [searchResults, setSearchResults] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [sellers, setSellers] = useState([]);
    const [sellerCreated, setSellerCreated] = useState(false);
    const [sellerError, setSellerError] = useState(false);
    const [fetchingComplete, setFetchingComplete] = useState(false);

    const [isAddSellerVisible, setIsAddSellerVisible] = useState(true);
    const [isSellersStatusVisible, setIsSellersStatusVisible] = useState(false);

    const [newSeller, setNewSeller] = useState({
        firstName: '',  // For first name input
        lastName: '',   // For last name input
        email: '',      // For email input
        password: '',   // For password input
        phone: {
            number: '', // For phone number input
        },
        address: {
            city: '',    // For city input
            state: '',   // For state input
            country: '', // For country input
        },
       
        platformRoles: ['seller'], // Default platform role as 'seller'
    });
    const [isClipboardCopied, setIsClipboardCopied] = useState(false);
    useEffect(() => {
        const token = authService.getToken();
        console.log("User:", user);
        const userId = user?._id;
        console.log("User ID:", userId);
        console.log("token:", token);

        if (token) {
            if (!fetchingComplete) {
                fetchSellers(userId);
            }

        }
    }, [fetchingComplete, user]);


    const [selectedListing, setSelectedListing] = useState(null);
    const [selectedListingFetched, setSelectedListingFetched] = useState(false);


    const handleRowClick = (listing) => {

        fetchSelectedSellers(listing._id);
        setSelectedListing(listing); // Open overlay with the selected conversation
    };

    const fetchSelectedSellers = async (listingId) => {

        console.log("fetch listing..", listingId);

        try {
            const response = await userService.getListingById(listingId);
            console.log("selected listing..", response);
            if (response.success) {
                setIsLoading(false);
                setSelectedListingFetched(true);
                // setMsgCount(response.data.count);
                // setMessages(response.data);


            }


        } catch (error) {
            console.error('Error fetching sellers:', error);
            setIsLoading(false);
        }
    };

  
    useEffect(() => {
        if (isClipboardCopied) {
            setTimeout(() => {
                setIsClipboardCopied(false);
            }, 1000);
        }
    }, [isClipboardCopied]);

    const fetchSellers = async (userId) => {

        console.log("fetch sellers.. userId", userId);

        try {
            const response = await userService.getUsersByRole('seller');
            console.log("response sellers..", response);
            if (response.success) {
                setSellers(response.data);
                setIsLoading(false);
                setFetchingComplete(true);
            }


        } catch (error) {
            console.error('Error fetching sellers:', error);
            setIsLoading(false);
        }
    };
    // const handleSellerChange = (e) => {
    //     if (!e || !e.target) {
    //         console.error('Invalid event object:', e);
    //         return;
    //     }

    //     const { name, value } = e.target;


    //     setNewSeller((prevSeller) => ({
    //         ...prevSeller,
    //         [name]: value,
    //     }));

    // };

    const handleSellerChange = (e) => {
        if (!e || !e.target) {
            console.error('Invalid event object:', e);
            return;
        }
    
        const { name, value } = e.target;
    
        setNewSeller((prevSeller) => {
            const keys = name.split('.'); // Split the name (e.g., "phone.number" => ["phone", "number"])
            if (keys.length === 1) {
                // For top-level fields
                return {
                    ...prevSeller,
                    [name]: value,
                };
            } else {
                // For nested fields
                const [outerKey, innerKey] = keys;
                return {
                    ...prevSeller,
                    [outerKey]: {
                        ...prevSeller[outerKey], // Preserve other nested properties
                        [innerKey]: value, // Update the specific nested property
                    },
                };
            }
        });
    };
    


    const onClose = () => {
        setSellerCreated(false);
        setSellerError(false);

    };

   
    const handleSellerSubmit = async (e) => {

        e.preventDefault();


        const action = e.nativeEvent.submitter.value;
        // console.log("action..", action);

        if (action === 'cancel') {
            setNewSeller({
                firstName: '',  // For first name input
                lastName: '',   // For last name input
                email: '',      // For email input
                password: '',   // For password input
                phone: {
                    number: '', // For phone number input
                },
                address: {
                    city: '',    // For city input
                    state: '',   // For state input
                    country: '', // For country input
                },
               
                platformRoles: ['seller'], // Default platform role as 'seller'
            });

        }
        else {
            setSellerCreated(false);
            try {
                const sellerData = {
                    ...newSeller,
                    
                };

                console.log("Payload being sent to backend:", sellerData);

                const response = await userService.createUser(sellerData);
                console.log("response listing..", response);
                console.log("response listing success..", response.success);
                if (response.success) {
                    setSellerCreated(true);
                    setSellerError(false);
                } else {
                    setSellerError(true);
                    setSellerCreated(false);

                }
                setNewSeller({
                    firstName: '',  // For first name input
                    lastName: '',   // For last name input
                    email: '',      // For email input
                    password: '',   // For password input
                    phone: {
                        number: '', // For phone number input
                    },
                    address: {
                        city: '',    // For city input
                        state: '',   // For state input
                        country: '', // For country input
                    },
                    
                    platformRoles: ['seller'], // Default platform role as 'seller'
                });
                // Trigger fetchSellers with a delay
                setTimeout(() => {
                    fetchSellers(user._id);
                }, 2000); // 2-second delay
            } catch (error) {
                console.error('Error creating listing:', error);
            }

        }


    };

    const handleSellerDelete = async (id) => {
        console.log("Attempting to delete seller with ID:", id);
        try {
            const response = await userService.deleteUser(id);
            console.log("Response data:", response.data);

            // Trigger fetchSellers with a delay
            setTimeout(() => {
                fetchSellers(user._id);
            }, 2000); // 2-second delay
        } catch (error) {
            console.error('Error deleting listing:', error);
        }
    };

    const handleListingApprove = async (id) => {
        console.log("Approve");
    }

    const handleListingReject = async (id) => {
        console.log("To reject.");
    }


    function handleToggleVisibility(contentType) {
        // Set the visibility of the content based on the button clicked
        setIsAddSellerVisible(contentType === 'addSeller');
        setIsSellersStatusVisible(contentType === 'sellersStatus');

    };

    const closeOverlay = () => {
        setSelectedListing(null); // Close the overlay
    };




    return (


        <div className='listings-container'>

            <div className='buttons-container'>
                <Button onClick={() => handleToggleVisibility('addSeller')}
                    variant='mini'

                    className={isAddSellerVisible ? 'active' : ''}>
                    Add Seller
                </Button>
                <Button onClick={() => handleToggleVisibility('sellersStatus')}
                    variant='mini'

                    className={isSellersStatusVisible ? 'active' : ''}>
                    See Sellers
                </Button>
            </div>

            <div className='listings-content' >

                {isAddSellerVisible && (
                    <div className='new-listing-container'>
                        <div className='seller-content-form'>
                            <h3>Add new Seller</h3>
                            <form onSubmit={handleSellerSubmit}>
                                <Input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={newSeller.firstName}
                                    variant="secondary"
                                    onChange={handleSellerChange}
                                />

                                <Input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={newSeller.lastName}
                                    variant="secondary"
                                    onChange={handleSellerChange}
                                />

                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={newSeller.email}
                                    variant="secondary"
                                    onChange={handleSellerChange}
                                />

                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={newSeller.password}
                                    variant="secondary"
                                    onChange={handleSellerChange}
                                />

                                <Input
                                    type="text"
                                    name="phone.number"
                                    placeholder="Phone Number"
                                    value={newSeller.phone?.number}
                                    variant="secondary"
                                    onChange={handleSellerChange}
                                />

                                <Input
                                    type="text"
                                    name="address.city"
                                    placeholder="City"
                                    value={newSeller.address?.city}
                                    variant="secondary"
                                    onChange={handleSellerChange}
                                />

                                <Input
                                    type="text"
                                    name="address.state"
                                    placeholder="State"
                                    value={newSeller.address?.state}
                                    variant="secondary"
                                    onChange={handleSellerChange}
                                />

                                <Input
                                    type="text"
                                    name="address.country"
                                    placeholder="Country"
                                    value={newSeller.address?.country}
                                    variant="secondary"
                                    onChange={handleSellerChange}
                                />
                             
                                {/* Set platformRoles to default to 'seller' */}
                                <select
                                    name="platformRoles"
                                    value={newSeller.platformRoles || ['seller']}
                                    onChange={handleSellerChange}
                                >
                                    <option value="buyer">Buyer</option>
                                    <option value="seller">Seller</option>
                                    <option value="admin">Admin</option>
                                </select>


                                <div className="button-group">
                                    <Button type="submit" variant="primary" name="action" value="create">
                                        Add Seller
                                    </Button>
                                    <Button type="submit" variant="secondary" name="action" value="cancel">
                                        Cancel
                                    </Button>
                                </div>
                            </form>

                        </div>

                    </div>

                )}

                {isSellersStatusVisible && (
                    <div className='listings-status-container'>
                        {isLoading && <p>Loading...</p>}
                        <h4>Sellers on database</h4>
                        {/* <select
                            name="platformRoles"
                            value={['seller']}
                            onChange={handleSellerChange}
                            style={{ width: '50%' }}
                        >
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                        </select> */}
                        <table>
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                   
                                </tr>
                            </thead>
                            <tbody>
                                {sellers.map((seller) => (
                                    <tr key={seller._id}
                                        onClick={() => handleRowClick(seller)}
                                        style={{ cursor: "pointer" }}
                                    >
                                       
                                        <td>{seller.firstName}</td>
                                        <td>{seller.lastName}</td>
                                        <td>{seller.email}</td>
                                        <td>{seller.phone?.number || 'N/A'}</td>
                                        <td>{seller.accountStatus}</td>
                                        <td>
                                            <button onClick={() => handleSellerDelete(seller._id)}><FaEllipsisV /> </button>
                                           
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedListingFetched && selectedListing && (
                    <ListingCard
                        listing={selectedListing}
                        closeOverlay={closeOverlay}
                        handleApprove={handleListingApprove}
                        handleReject={handleListingReject}
                    />
                )}

                {sellerCreated && !sellerError &&
                    (
                        <SuccessOverlay onClose={onClose} />
                    )}

                {!sellerCreated && sellerError && (
                    <ErrorOverlay onClose={onClose} onRetry={handleSellerSubmit} />
                )}

            </div>



        </div>



    );
};

export default Sellers;