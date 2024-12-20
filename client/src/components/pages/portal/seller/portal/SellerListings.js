import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './SellerListings.scss'; // Import CSS file for styling
import { FaEye, FaEyeSlash, FaCopy, FaTrash } from 'react-icons/fa';

import { authService } from '../../../../../services/api/auth';
import { listingService } from '../../../../../services/api/listing';

import UploadWidgetClaudinary from './UploadWidgetClaudinary';
import SuccessOverlay from './SuccessOverlay';
import ErrorOverlay from './ErrorOverlay';
import Button from '../../../../common/button/Button';
import Input from '../../../../common/input/Input';

const SellerListings = () => {

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
    // console.log("User:", user);
    const userId = user?._id;
    // console.log("User ID:", userId);
    // console.log("token:", token);

    if (token) {
      if (!fetchingComplete) {
        fetchListings(userId);
      }

    }
  }, [fetchingComplete, user]);



  const [originalUrl, setOriginalUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');
  const [fetchedImageUrl, setFetchedImageUrl] = useState([]);

  // You can pass this function to the child component
  const handleFetchedImageUrls = (images) => {
    console.log("images fetched from cloudinary widget..",images);
    setFetchedImageUrl(images); // Update the parent state with the new image URLs
  };


  const convertUrl = () => {
    // Regular expression to extract the file ID from the original URL
    const fileIdMatch = originalUrl.match(/https:\/\/drive\.google\.com\/file\/d\/(.+?)\/view/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      // Construct the converted URL in thumbnail format
      const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}`;
      setConvertedUrl(thumbnailUrl);
    } else {
      setConvertedUrl('Invalid URL');
    }
  };

  // Function to copy the converted URL to the clipboard
  // const copyToClipboard = () => {
  //   navigator.clipboard.writeText(convertedUrl)
  //     .then(() => {
  //       // alert('Converted URL copied to clipboard!');
  //       setIsClipboardCopied(true);
  //     })
  //     .catch(() => {
  //       alert('Failed to copy the URL');
  //     });
  // };

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

  const fetchListings = async (userId) => {

    // console.log("fetchlisting.. userId", userId);

    try {
      const response = await listingService.getListingsByUser(userId);
      // console.log("response..", response);
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
    // console.log("Updating image:", newListing.images);
    const updatedImages = [...newListing.images];
    updatedImages[index] = {
        ...updatedImages[index],
        [field]: e.target.value,
    };
    console.log("Updated image data:", updatedImages);

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
    // console.log("fetechedImage..", fetchedImageUrl);
    const updatedImages = fetchedImageUrl.filter((_, i) => i !== index);
    setFetchedImageUrl(updatedImages);



    // const updatedImages = newListing.images.filter((_, i) => i !== index);
    setNewListing((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  
  // Assuming fetchedImageUrl is available and fetched successfully
useEffect(() => {
  if (fetchedImageUrl?.length > 0) {
      // Transform fetchedImageUrl to match the structure of newListing.images
      const transformedImages = fetchedImageUrl.map((image, index) => ({
          url: image.url,
          alt: image.filename || `Image ${index + 1}`, // Default alt text
          isPrimary: index === 0, // Optionally set the first image as primary
      }));

      // Update newListing with the transformed images
      setNewListing((prev) => ({
          ...prev,
          images: transformedImages,
      }));
  }
}, [fetchedImageUrl]);



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
      console.log("newlisting..",newListing);
      setListingCreated(false);
     
      try {
        const listingData = {
          ...newListing,
          user: user._id,
          sku: generateUniqueSKU(), // You'll need to implement this
          category: 'tractor', // Or dynamically set
          status: 'draft', // Default status
        };

        // console.log("Payload being sent to backend:", listingData);

        const response = await listingService.createListing(listingData);
        // console.log("response listing..", response);
        // console.log("response listing success..", response.success);
        if (response.success) {
          setListingCreated(true);
          setListingError(false);
          setNewListing((prev) => ({
            ...prev,
            images: [],
        }));
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
          fetchListings(user._id);
        }, 2000); // 2-second delay
      } catch (error) {
        console.error('Error creating listing:', error);
      }

    }


  };

  const handleListingDelete = async (id) => {
    // console.log("Attempting to delete listing with ID:", id);
    try {
      const response = await listingService.deleteListing(id);
      console.log("Response data:", response.data);

      // Trigger fetchListings with a delay
      setTimeout(() => {
        fetchListings(user._id);
      }, 2000); // 2-second delay
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

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
                              
                              defaultChecked={image.isPrimary || false}
                              onChange={(e) => {
                                e.target.checked = !e.target.checked; // Toggle the checked state
                              }}
                              style={{display:'inline-block'}}
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

            {/* {fetchedImageUrl && (
              fetchedImageUrl.map((image, index) => (
                <div key={index}>
                  <p>{image.url}</p>
                  <p>{image.filename}</p>
                </div>
              ))

            )} */}

          </div>

        )}

        {isListingsStatusVisible && (
          <div className='listings-status-container'>
            {isLoading && <p>Loading...</p>}
            <h4>Listings on database</h4>
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Service Hours</th>
                  <th>Price</th>
                  <th>Location</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing._id}>
                    <td><img src={listing.image} alt={listing.name} /></td>
                    <td>{listing.name}</td>
                    <td>{listing.sku}</td>
                    <td>{listing.category}</td>
                    <td>{listing.description}</td>
                    <td>{listing.make}</td>
                    <td>{listing.model}</td>
                    <td>{listing.serviceHours}</td>
                    <td>{listing.price.amount}</td>
                    <td>{listing.location?.city}, {listing.location?.state}, {listing.location?.country}</td>
                    <td>{listing.quantity}</td>
                    <td>{listing.status}</td>
                    <td>
                      <button onClick={() => handleListingDelete(listing._id)}><FaTrash /> </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default SellerListings;