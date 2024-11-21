import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './SellerListings.scss'; // Import CSS file for styling
import { FaEye, FaEyeSlash, FaCopy, FaTrash } from 'react-icons/fa';

import { listingService } from '../../../../../services/api/listing';

import UploadWidgetClaudinary from './UploadWidgetClaudinary';

const SellerListings = () => {

  const [searchResults, setSearchResults] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState([]);
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
    const token = localStorage.getItem('authToken');
    console.log("User:", user);
    console.log("User ID:", user._id);

    if (token) {
      const userId = user?.id;
      fetchListings(userId);
    }
  }, []);

  const [originalUrl, setOriginalUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');


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
  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedUrl)
      .then(() => {
        // alert('Converted URL copied to clipboard!');
        setIsClipboardCopied(true);
      })
      .catch(() => {
        alert('Failed to copy the URL');
      });
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

  const fetchListings = async (userId) => {

    try {
      const response = await listingService.getListingsByUser(userId);
      setListings(response);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setIsLoading(false);
    }
  };
  const handleListingChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'price.amount') {
      // Update the amount in the price object
      setNewListing((prevListing) => ({
        ...prevListing,
        price: {
          ...prevListing.price,
          amount: value,
        },
      }));
    } else if (name === 'price.currency') {
      // Update the currency in the price object
      setNewListing((prevListing) => ({
        ...prevListing,
        price: {
          ...prevListing.price,
          currency: value,
        },
      }));
    } else {
      // Update other top-level fields
      setNewListing((prevListing) => ({
        ...prevListing,
        [name]: value,
      }));
    }
  };
  

  const handleListingSubmit = async (e) => {
    e.preventDefault();
    try {
      const listingData = {
        ...newListing,
        seller: user._id,
        sku: generateUniqueSKU(), // You'll need to implement this
        category: 'tractor', // Or dynamically set
        status: 'draft', // Default status
      };

      console.log("Payload being sent to backend:", listingData);

      const response = await listingService.createListing(listingData);
      console.log("response listing..",response);

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
      fetchListings();
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  };

  const handleListingDelete = async (id) => {
    try {
      await listingService.deleteListing(id);
      fetchListings();
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

  return (
    < >

      <div className='sub-container'>
        <div className='seller-listing-controller'>
          <div className='seller-content-form'>
            <h3>Add new listing</h3>
            <form onSubmit={handleListingSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Listing Name"
                value={newListing.name}
                onChange={handleListingChange}
              />

              <div className="sku-input-group" style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  name="sku"
                  placeholder="SKU"
                  value={newListing.sku}
                  onChange={handleListingChange}
                />
                <button
                  type="button" // Important: type="button" prevents form submission
                  onClick={generateAndSetSKU}
                  style={{ padding: '8px 16px' }}
                >
                  Generate SKU
                </button>
              </div>

              <select
                name="category"
                value={newListing.category}
                onChange={handleListingChange}
              >
                <option value="tractor">Tractor</option>
                <option value="spare parts">Spare Parts</option>
              </select>

              <textarea
                name="description"
                placeholder="Listing Description"
                value={newListing.description}
                onChange={handleListingChange}
              ></textarea>

              <input
                type="text"
                name="make"
                placeholder="Make"
                value={newListing.make}
                onChange={handleListingChange}
              />

              <input
                type="text"
                name="model"
                placeholder="Model"
                value={newListing.model}
                onChange={handleListingChange}
              />

              <input
                type="number"
                name="serviceHours"
                placeholder="Service Hours"
                value={newListing.serviceHours}
                onChange={handleListingChange}
              />

              <input
                type="number"
                name="price.amount"
                placeholder="Price"
                value={newListing.price.amount}
                onChange={handleListingChange}
              />

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={newListing.location}
                onChange={handleListingChange}
              />

              {/* <div className='featured'>
                  <p>Featured</p>
                  <div
                    className="toggle-container"
                    onClick={() => setNewListing(prev => ({
                      ...prev,
                      visibility: {
                        ...prev.visibility,
                        isFeatured: !prev.visibility.isFeatured
                      }
                    }))}
                  >
                    <div className={`toggle-button ${newListing.visibility.isFeatured ? 'checked' : ''}`}>
                      <div className="toggle-slider" />
                    </div>
                  </div>
                </div> */}

              <input
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
              />

              <button type="submit">Create Listing</button>
            </form>
          </div>
          <div className='seller-cloudinary-container'>
            <UploadWidgetClaudinary folderName='listings' />
          </div>
        </div>

        <div className='listings-table'>
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
                  <td>{listing.location}</td>
                  <td>{listing.quantity}</td>
                  <td>
                    <button onClick={() => handleListingDelete(listing._id)}><FaTrash /> </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


    </>
  );
};

export default SellerListings;