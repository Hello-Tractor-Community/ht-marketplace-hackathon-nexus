import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import './Listings.scss'; // Import CSS file for styling
import {  FaSync, FaTrash, FaCheck, FaEllipsisV } from 'react-icons/fa';

import { authService } from '../../../../../services/api/auth';
import { listingService } from '../../../../../services/api/listing';

import UploadWidgetClaudinary from './UploadWidgetClaudinary';
import SuccessOverlay from './SuccessOverlay';
import ErrorOverlay from './ErrorOverlay';
import Button from '../../../../common/button/Button';
import Input from '../../../../common/input/Input';

import ListingCard from './ListingCard';

const Listings = () => {

  const [searchResults, setSearchResults] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [listingCreated, setListingCreated] = useState(false);
  const [listingError, setListingError] = useState(false);
  const cloudinaryFolder = process.env.CLOUDINARY_UPLOAD_PRODUCT_FOLDER || 'products';
  const [fetchingComplete, setFetchingComplete] = useState(false);
  // const cloudinaryFolder = 'products';
  const [isNewListingsVisible, setIsNewListingsVisible] = useState(true);
  const [isListingsStatusVisible, setIsListingsStatusVisible] = useState(false);
  const tableRef = useRef(null); 
  const [newListing, setNewListing] = useState({
    name: '',
    sku: '',
    category: 'tractor', // Default category
    description: '',
    make: '',
    model: '',
    serviceHours: '',
    price: {
      amount: '', // Default amount
      currency: 'USD', // Default currency or leave blank
    },
    images: [],
    location: '',
    status: 'draft',
    visibility: {
      isFeatured: false,
      isNewArrival: false
    },
    inventory: {
      quantity: 0,
      lowStockThreshold: 5,
      allowBackorder: false
    }
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
        fetchListings();
      }

    }
  }, [fetchingComplete, user]);

  const handleRefresh = () =>{
    setIsLoading(true);
    fetchListings();

  }

  const [originalUrl, setOriginalUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');
  const [fetchedImageUrl, setFetchedImageUrl] = useState([]);

  // You can pass this function to the child component
  const handleFetchedImageUrls = (images) => {
    setFetchedImageUrl(images); // Update the parent state with the new image URLs
  };



  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedListingFetched, setSelectedListingFetched] = useState(false);


  const handleRowClick = (listing) => {

    fetchSelectedListings(listing._id);
    setSelectedListing(listing); // Open overlay with the selected conversation
  };

  const fetchSelectedListings = async (listingId) => {

    console.log("fetch listing..", listingId);

    try {
      const response = await listingService.getListingById(listingId);
      console.log("selected listing..", response);
      if (response.success) {
        setIsLoading(false);
        setSelectedListingFetched(true);
        // setMsgCount(response.data.count);
        // setMessages(response.data);


      }


    } catch (error) {
      console.error('Error fetching listings:', error);
      setIsLoading(false);
    }
  };

  const generateUniqueSKU = () => {
    const prefix = 'LT'; // Listing prefix
    const timestamp = Date.now().toString(36); // Convert timestamp to base36 string
    const randomStr = Math.random().toString(36).substring(2, 5); // Random 3-char string
    return `${prefix}-${timestamp}-${randomStr}`.toUpperCase();
  };

  useEffect(() => {
    if (isClipboardCopied) {
      setTimeout(() => {
        setIsClipboardCopied(false);
      }, 1000);
    }
  }, [isClipboardCopied]);

  const fetchListings = async () => {   

    try {
      const response = await listingService.getListings();
      console.log("response..", response);
      if (response.success) {
        setListings(response.data);
        setIsLoading(false);
        setFetchingComplete(true);
      }


    } catch (error) {
      console.error('Error fetching listings:', error);
      setIsLoading(false);
    }
  };
  const handleListingChange = (e) => {
    if (!e || !e.target) {
      console.error('Invalid event object:', e);
      return;
    }

    const { name, value } = e.target;

    if (name === 'price.amount') {
      setNewListing((prevListing) => ({
        ...prevListing,
        price: {
          ...prevListing.price,
          amount: value,
        },
      }));
    } else if (name === 'price.currency') {
      setNewListing((prevListing) => ({
        ...prevListing,
        price: {
          ...prevListing.price,
          currency: value,
        },
      }));
    } else {
      setNewListing((prevListing) => ({
        ...prevListing,
        [name]: value,
      }));
    }
  };


  const onClose = () => {
    setListingCreated(false);
    setListingError(false);

  };

  const handleImageChange = (e, index, field) => {
    const updatedImages = [...newListing.images];
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: e.target.value,
    };
    setNewListing((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const addImage = () => {
    if (newListing.images.length < 3) {
      setNewListing((prev) => ({
        ...prev,
        images: [...prev.images, { url: '', alt: '', isPrimary: false }],
      }));
    }
  };

  const removeImage = (index) => {
    console.log("fetechedImage..", fetchedImageUrl);
    const updatedImages = fetchedImageUrl.filter((_, i) => i !== index);
    setFetchedImageUrl(updatedImages);



    // const updatedImages = newListing.images.filter((_, i) => i !== index);
    setNewListing((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };



  const handleListingSubmit = async (e) => {

    e.preventDefault();


    const action = e.nativeEvent.submitter.value;
    // console.log("action..", action);

    if (action === 'cancel') {
      setNewListing({
        name: '',
        sku: '',
        category: 'tractor', // Default category
        description: '',
        make: '',
        model: '',
        serviceHours: '',
        price: {
          amount: '', // Default amount
          currency: 'USD', // Default currency or leave blank
        },
        images: [],
        location: '',
        status: 'draft',
        visibility: {
          isFeatured: false,
          isNewArrival: false
        },
        inventory: {
          quantity: 0,
          lowStockThreshold: 5,
          allowBackorder: false
        }
      });
    }
    else {
      setListingCreated(false);
      try {
        const listingData = {
          ...newListing,
          user: user._id,
          sku: generateUniqueSKU(), // You'll need to implement this
          category: 'tractor', // Or dynamically set
          status: 'draft', // Default status
        };

        console.log("Payload being sent to backend:", listingData);

        const response = await listingService.createListing(listingData);
        console.log("response listing..", response);
        console.log("response listing success..", response.success);
        if (response.success) {
          setListingCreated(true);
          setListingError(false);
        } else {
          setListingError(true);
          setListingCreated(false);

        }
        setNewListing({
          name: '',
          sku: '',
          category: 'tractor', // Default category
          description: '',
          make: '',
          model: '',
          serviceHours: '',
          price: {
            amount: '', // Default amount
            currency: 'USD', // Default currency or leave blank
          },
          images: [],
          location: '',
          status: 'draft',
          visibility: {
            isFeatured: false,
            isNewArrival: false
          },
          inventory: {
            quantity: 0,
            lowStockThreshold: 5,
            allowBackorder: false
          }
        });
        // Trigger fetchListings with a delay
        setTimeout(() => {
          fetchListings();
        }, 2000); // 2-second delay
      } catch (error) {
        console.error('Error creating listing:', error);
      }

    }


  };

  const handleListingDelete = async (id) => {
    console.log("Attempting to delete listing with ID:", id);
    try {
      const result = await listingService.deleteListing(id);
      console.log("Response data:", result);
      if (result.success) {
        setStatusUpdated(true);
      } else {
        setListingError(result.error);
      }

      // Trigger fetchListings with a delay
      setTimeout(() => {
        fetchListings(user._id);
      }, 2000); // 2-second delay
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };


  const [statusUpdated, setStatusUpdated] = useState(false);
  const [listingAction, setListingAction] = useState({}); // Initialize as an object

  const toggleListingAction = (index) => {
    setListingAction((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle only the specific index
    }));
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStatusUpdated(false);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [statusUpdated]);

  const handleListingApprove = async (id) => {

    console.log("handlelistingapprove.");

    try {
      const result = await listingService.updateListingStatus(id, "active");

      if (result.success) {
        setStatusUpdated(true);
      } else {
        setListingError(result.error);
      }
    } catch (err) {
      setListingError('Failed to update listing status');
    }
  }

  const handleListingReject = async (id) => {
    try {
      const result = await listingService.updateListingStatus(id, "inactive");

      if (result.success) {
        setStatusUpdated(true);
      } else {
        setListingError(result.error);
      }
    } catch (err) {
      setListingError('Failed to update listing status');
    }
  }


  const [isFeatureChecked, setIsFeatureChecked] = useState(false);

  const handleToggle = () => {
    setIsFeatureChecked(!isFeatureChecked);
    setNewListing({ ...newListing, isFeatured: !isFeatureChecked });
  };

  const generateAndSetSKU = () => {
    const newSKU = generateUniqueSKU();
    setNewListing(prev => ({
      ...prev,
      sku: newSKU
    }));
  };

  function handleToggleVisibility(contentType) {
    // Set the visibility of the content based on the button clicked
    setIsNewListingsVisible(contentType === 'newListings');
    setIsListingsStatusVisible(contentType === 'listingsStatus');

  };

  const closeOverlay = () => {
    setSelectedListing(null); // Close the overlay
  };

  const resetListingActions = () => {
    setListingAction({}); // Reset all indexes to false
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        resetListingActions(); // Reset actions if clicked outside the table
      }
    };

    // Add event listener to detect clicks outside
    document.addEventListener("click", handleClickOutside);

    return () => {
      // Clean up the event listener
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);




  return (


    <div className='listings-container'>

      <div className='buttons-container'>
        <Button onClick={() => handleToggleVisibility('newListings')}
          variant='mini'

          className={isNewListingsVisible ? 'active' : ''}>
          Create Listing
        </Button>
        <Button onClick={() => handleToggleVisibility('listingsStatus')}
          variant='mini'

          className={isListingsStatusVisible ? 'active' : ''}>
          See Listings
        </Button>
      </div>

      <div className='listings-content' >

        {isNewListingsVisible && (
          <div className='new-listing-container'>
            <div className='seller-content-form'>
              <h3>Add new listing</h3>
              <form onSubmit={handleListingSubmit}>

                <Input
                  type="text"
                  name="name"
                  placeholder="Listing Name"
                  value={newListing.name}
                  variant='secondary'
                  onChange={handleListingChange}
                />

                <div className="sku-input-group" style={{ display: 'flex', gap: '8px' }}>
                  <Input
                    type="text"
                    name="sku"
                    placeholder="SKU"
                    value={newListing.sku}
                    variant='secondary'
                    onChange={handleListingChange}
                  />
                  <Button
                    type="button"
                    onClick={generateAndSetSKU}
                    variant='mini'
                  >
                    Generate SKU
                  </Button>
                </div>


                <div>
                  <label>Images:</label>
                  {fetchedImageUrl && (
                    <div>
                      {fetchedImageUrl.map((image, index) => (
                        <div key={index}
                        >

                          <input
                            type="text"
                            name={`altText${index}`}
                            placeholder="Alt text"
                            value={image.url || ''}
                            onChange={(e) => handleImageChange(e, index, 'alt')}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <Button type="button" onClick={() => removeImage(index)}
                              variant='mini'>Remove</Button>
                            <label>
                              <input
                                type="checkbox"
                                // checked={image.isPrimary || false}
                                defaultChecked={image.isPrimary || false}
                                // onChange={(e) => handleImageChange(e, index, 'isPrimary')}
                                onChange={(e) => {
                                  e.target.checked = !e.target.checked; // Toggle the checked state
                                }}
                                style={{ display: 'inline-block' }}
                              />
                              Primary Image
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}


                </div>

                <textarea
                  name="description"
                  placeholder="Listing Description"
                  value={newListing.description}
                  onChange={handleListingChange}
                ></textarea>

                <select
                  name="category"
                  value={newListing.category}
                  onChange={handleListingChange}
                >
                  <option value="tractor">Tractor</option>
                  <option value="spare parts">Spare Parts</option>
                </select>

                <Input
                  type="text"
                  name="make"
                  placeholder="Make"
                  value={newListing.make}
                  variant='secondary'
                  onChange={handleListingChange}
                />
                <Input
                  type="text"
                  name="model"
                  placeholder="Model"
                  value={newListing.model}
                  variant='secondary'
                  onChange={handleListingChange}
                />

                <Input
                  type="number"
                  name="serviceHours"
                  placeholder="Service Hours"
                  value={newListing.serviceHours}
                  variant='secondary'
                  onChange={handleListingChange}
                />

                <Input
                  type="number"
                  name="price.amount"
                  placeholder="Price"
                  value={newListing.price.amount}
                  variant='secondary'
                  onChange={handleListingChange}
                />
                <Input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={newListing.location}
                  variant='secondary'
                  onChange={handleListingChange}
                />
                {/* <input
                  type="number"
                  name="inventory.quantity"
                  placeholder="Inventory Quantity"
                  value={newListing.inventory.quantity}
                  onChange={(e) => setNewListing(prev => ({
                    ...prev,
                    inventory: {
                      ...prev.inventory,
                      quantity: parseInt(e.target.value)
                    }
                  }))}
                /> */}

                <Input
                  type="number"
                  name="inventory.quantity"
                  placeholder="Inventory Quantity"
                  value={newListing.inventory.quantity}
                  variant='secondary'
                  onChange={(e) => setNewListing(prev => ({
                    ...prev,
                    inventory: {
                      ...prev.inventory,
                      quantity: parseInt(e.target.value)
                    }
                  }))}
                />

                <div className="button-group">

                  <Button type="submit" variant='primary' name="action" value="create" >Create Listing</Button>
                  <Button type="submit" variant='secondary' name="action" value="cancel" >Cancel</Button>


                </div>



              </form>
            </div>
            <div className='seller-cloudinary-container'>
              <UploadWidgetClaudinary folderName={cloudinaryFolder}
                setFetchedImageUrl={handleFetchedImageUrls} />
            </div>

          </div>

        )}

        {isListingsStatusVisible && (
          <div className='listings-status-container'>
            <Button variant='mini' onClick={handleRefresh}

          
            >
              <FaSync/>
            </Button>

            {isLoading && <p style={{position:"fixed", top:'50%',left:'50%',
              color:"hsl(218 69% 1%)", backgroundColor:"hsl(0 0% 99%)", 
              padding:"4px 8px"
            }}>Loading...</p>}

            <h4>Listings on database</h4>
            <table ref={tableRef}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing, index) => (
                  <tr key={listing._id}
                    onClick={(e) => {
                      if (!e.defaultPrevented) handleRowClick(listing); // Ensures the row click is isolated
                    }}
                    style={{ cursor: "pointer" }}
                  >

                    <td>{listing.images?.length > 0 ? 'Has image' : 'No image'}</td>
                    <td>{listing.name}</td>
                    <td>{listing.category}</td>
                    <td>{listing.description.length > 50 ? `${listing.description.slice(0, 50)}...` : listing.description}</td>
                    <td>{listing.price.amount}</td>
                    <td>{listing.location?.city}, {listing.location?.state}, {listing.location?.country}</td>
                    <td>{listing.status}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); 
                          toggleListingAction(index);
                        }}
                        className='action'
                      >
                        <FaEllipsisV />
                      </button>

                      {listingAction[index] && (
                        <div style={{ display: "flex" }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}>
                          <button onClick={(e) => {
                            e.stopPropagation();
                            handleListingDelete(listing._id);
                          }}
                          className='reject'>
                            <FaTrash />
                          </button>
                          <button onClick={(e) => {
                            e.stopPropagation();
                            handleListingApprove(listing._id);
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

        {selectedListingFetched && selectedListing && (
          <ListingCard
            listing={selectedListing}
            closeOverlay={closeOverlay}
            handleApprove={handleListingApprove}
            handleReject={handleListingReject}
          />
        )}

        {statusUpdated && (
          <p className='status-success'>Success!</p>
        )}

        {listingCreated && !listingError &&
          (
            <SuccessOverlay onClose={onClose} />
          )}

        {!listingCreated && listingError && (
          <ErrorOverlay onClose={onClose} onRetry={handleListingSubmit} />
        )}



      </div>



    </div>



  );
};

export default Listings;