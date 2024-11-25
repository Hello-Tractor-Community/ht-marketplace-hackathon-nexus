import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import './Sellers.scss'; // Import CSS file for styling
import { FaTrash, FaCheck, FaEllipsisV, FaSync } from 'react-icons/fa';

import { authService } from '../../../../../services/api/auth';
import { userService } from '../../../../../services/api/user';
import SuccessOverlay from './SuccessOverlay';
import ErrorOverlay from './ErrorOverlay';
import Button from '../../../../common/button/Button';
import Input from '../../../../common/input/Input';

import SellerCard from './SellerCard';

const Sellers = () => {

    const [searchResults, setSearchResults] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [sellers, setSellers] = useState([]);
    const [sellerCreated, setSellerCreated] = useState(false);
    const [sellerError, setSellerError] = useState(false);
    const [fetchingComplete, setFetchingComplete] = useState(false);
    const [statusUpdated, setStatusUpdated] = useState(false);
    const [sellerAction, setSellerAction] = useState({});
    const [isAddSellerVisible, setIsAddSellerVisible] = useState(true);
    const [isSellersStatusVisible, setIsSellersStatusVisible] = useState(false);
    const tableRef = useRef(null);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [selectedSellerFetched, setSelectedSellerFetched] = useState(false);
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
                fetchSellers();
            }

        }
    }, [fetchingComplete, user]);

    const handleRefresh = () => {
        setIsLoading(true);
        fetchSellers();

    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
          setStatusUpdated(false);
        }, 2000);
        return () => clearTimeout(timeoutId);
      }, [statusUpdated]);

      useEffect(()=>{
        console.log("Selected seller is..",selectedSeller);
      },[selectedSeller]);


   

    const toggleSellerAction = (index) => {
        setSellerAction((prevState) => ({
            ...prevState,
            [index]: !prevState[index], // Toggle only the specific index
        }));
    };

    const handleRowClick = (seller) => {

        fetchSelectedSellers(seller._id);
        setSelectedSeller(seller); // Open overlay with the selected conversation
    };

    const fetchSelectedSellers = async (sellerId) => {

        console.log("fetch seller..", sellerId);

        try {
            const response = await userService.getUserById(sellerId);
            console.log("selected seller..", response);
            if (response.success) {
                setIsLoading(false);
                setSelectedSellerFetched(true);
             

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

    const fetchSellers = async () => {

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

    const resetSellerActions = () => {
        setSellerAction({}); // Reset all indexes to false
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tableRef.current && !tableRef.current.contains(event.target)) {
                resetSellerActions(); // Reset actions if clicked outside the table
            }
        };

        // Add event listener to detect clicks outside
        document.addEventListener("click", handleClickOutside);

        return () => {
            // Clean up the event listener
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);


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
                console.log("response seller..", response);
                console.log("response seller success..", response.success);
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
                console.error('Error creating seller:', error);
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
            console.error('Error deleting seller:', error);
        }
    };

    const handleSellerApprove = async (id) => {

        try {

            const result = await userService.updateUserStatus(id, 'active');
            if (result.success) {
                setStatusUpdated(true);
            } else {
                setSellerError(result.error);
            }
        } catch (err) {
            setSellerError('Failed to update seller status');
        }
    }


    const handleSellerReject = async (id) => {
        try {

            const result = await userService.updateUserStatus(id, 'suspended');
            if (result.success) {
                setStatusUpdated(true);
            } else {
                setSellerError(result.error);
            }
        } catch (err) {
            setSellerError('Failed to update seller status');
        }
    }




    function handleToggleVisibility(contentType) {
        // Set the visibility of the content based on the button clicked
        setIsAddSellerVisible(contentType === 'addSeller');
        setIsSellersStatusVisible(contentType === 'sellersStatus');

    };

    const closeOverlay = () => {
        setSelectedSeller(null); // Close the overlay
    };




    return (


        <div className='sellers-container'>

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

            <div className='sellers-content' >

                {isAddSellerVisible && (
                    <div className='new-seller-container'>
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
                    <div className='sellers-status-container'>
                        <Button variant='mini' onClick={handleRefresh}
                        >
                            <FaSync />
                        </Button>

                        {isLoading && <p style={{
                            position: "fixed", top: '50%', left: '50%',
                            color: "hsl(218 69% 1%)", backgroundColor: "hsl(0 0% 99%)",
                            padding: "4px 8px"
                        }}>Loading...</p>}
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
                        <table ref={tableRef}>
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
                                {sellers.map((seller, index) => (
                                    <tr key={seller._id}
                                        onClick={() => handleRowClick(seller)}
                                        style={{ cursor: "pointer", }}
                                    >

                                        <td>{seller.firstName}</td>
                                        <td>{seller.lastName}</td>
                                        <td>{seller.email}</td>
                                        <td>{seller.phone?.number || 'N/A'}</td>
                                        <td>{seller.accountStatus}</td>
                                        <td>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSellerAction(index);
                                                }}
                                                className='action'
                                            >
                                                <FaEllipsisV />
                                            </button>

                                            {sellerAction[index] && (
                                                <div style={{ display: "flex" }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}>
                                                    <button onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSellerDelete(seller._id);
                                                    }}
                                                        className='reject'>
                                                        <FaTrash />
                                                    </button>
                                                    <button onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSellerApprove(seller._id);
                                                    }}
                                                        className='approve'>
                                                        <FaCheck />
                                                    </button>
                                                </div>
                                            )}

                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedSellerFetched && selectedSeller && (
                    <SellerCard
                        seller={selectedSeller}
                        closeOverlay={closeOverlay}
                        handleApprove={handleSellerApprove}
                        handleReject={handleSellerReject}
                    />
                )}

                {statusUpdated && (
                    <p className='status-success'>Success!</p>
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