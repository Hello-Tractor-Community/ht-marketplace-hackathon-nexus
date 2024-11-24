// ListingDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { listingService } from '../../../services/api/listing';
import { userService } from '../../../services/api/user';
import { messageService } from '../../../services/api/messages';
import StarRating from './StarRating';
import Button from '../../common/button/Button';
import Input from '../../common/input/Input';
import MessageStatus from './MessageStatus';
import { format } from 'date-fns';
import Footer from '../public/footer/Footer';
import NavBar from '../../common/navigation/NavBar';

import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Tag,
  Calendar,
  Info,
  User,
  Package,
  Bookmark
} from 'lucide-react';
import api from '../../../services/api/config';

const ListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [seller, setSeller] = useState(null);
  const [showSellerInfo, setShowSellerInfo] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [messageToSeller, setMessageToSeller] = useState('');
  const [messageSendSuccess, setMessageSendSuccess] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [notLoggedIn, setNotLoggedIn] = useState(true);
  const [sellerInquiry, setSellerInquiry] = useState(false);

  useEffect(() => {
    fetchListingDetails(id);
    if(!user){
      setNotLoggedIn(true);
      setMessageToSeller('');
    }else{
      setNotLoggedIn(false);
      setMessageToSeller('');
    }
  }, [id, user]);

 



  const fetchListingDetails = async (id) => {
    try {
      setIsLoading(true);
      const response = await listingService.getListingById(id);
      if (response.success) {
        console.log("listing detail", response.data);
        setListing(response.data);
        setSelectedImage(0);
      } else {
        setError('Failed to fetch listing details');
      }
    } catch (err) {
      setError('An error occurred while fetching the listing');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSellerInfo = async () => {    

      console.log("trying to fetch seller info..", listing);
      const sellerId = listing.user._id;
      console.log("seller id..", sellerId);
  
      if (!sellerId) return;
  
  
      try {
        const response = await userService.getUserById(sellerId);
        if (response.success) {
          setSeller(response.data);
          setShowSellerInfo(true);
        }
      } catch (err) {
        console.error('Failed to fetch seller information:', err);
      }

  

    
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="text-red-500 text-center p-4">
        {error || 'Listing not found'}
      </div>
    );
  }



  const updateMessageToSeller = (event) => {
    setMessageToSeller(event.target.value);
    console.log('Message to seller:', event.target.value);
  };

  const handleSendMessage = async () => {

    setSellerInquiry(true);

    if(!notLoggedIn){
      if (messageToSeller) {
        // Show loading state if needed
        setIsLoading(true);
  
        try {
          const response = await messageService.handleMessageFlow(
            id,
            messageToSeller,
  
          );
  
          console.log("messageflow response.. ", response);
  
          if (response.success) {
            // Clear the message input
            setMessageToSeller('');
            setMessageSendSuccess(true);
            // Hide success message after 5 seconds
            setTimeout(() => setMessageSendSuccess(false), 5000);
            // Maybe update the UI to show the new message
            // If you have a messages list, you might want to update it
            // if (onMessageSent) {
            //     onMessageSent(response.data);
            // }
          } else {
            // Handle error
            setError(response.error || 'Failed to send message');
          }
        } catch (error) {
          setError('Failed to send message');
        } finally {
          setIsLoading(false);
        }
      }else{
        setError(true);
      }
    }

 
  };

  const clearStatus = () => {
    setError(null);
    setMessageSendSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <NavBar/>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <img
                src={listing.images[selectedImage] || "/api/placeholder/800/600"}
                alt={`${listing.name} - Image ${selectedImage + 1}`}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-6 gap-2">
              {listing && listing.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden h-20 border ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                >
                  <img
                    src={image || "/api/placeholder/150/150"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Listing Details */}
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{listing.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <StarRating value={listing.metrics?.averageRating || 0} />
                    <span>({listing.metrics?.totalReviews || 0} reviews)</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${listing.price?.amount}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {/* Product Details Section */}
                <div className="border-b pb-4">



                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-gray-500" />
                      <span>Make: {listing.make}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-gray-500" />
                      <span>Model: {listing.model}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span>Service Hours: {listing.serviceHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <span>Location: {listing.location?.city}, {listing.location?.state}, {listing.location?.country}</span>

                    </div>
                  </div>

                </div>

                {/* Description Section */}
                <div className="border-b pb-4">

                  <p className="mt-4 text-gray-600 whitespace-pre-line">
                    {listing.description}
                  </p>

                </div>

                {/* Seller Information Section */}
                <div className="mt-6">
                  {!showSellerInfo ? (
                    <button
                      onClick={fetchSellerInfo}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Display Seller Information
                    </button>
                  ) : (
                    <div className="border rounded-lg p-4 mt-4">
                      <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
                      {seller && (
                        <>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span>{seller.firstName} {seller.lastName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <span>{seller.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span>{seller.phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              {seller && seller.lastLogin && (
                                <span>
                                  {new Intl.DateTimeFormat("en-KE", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    timeZone: "Africa/Nairobi",
                                  }).format(new Date(seller.lastLogin))}
                                </span>
                              )}
                            </div>

                          </div>
                          <Input variant='primary'
                            placeholder='Write message to Seller'
                            onChange={updateMessageToSeller}
                          />
                          <Button variant='primary'
                            onClick={handleSendMessage}
                            disabled={isLoading || !messageToSeller}
                          >{isLoading ? 'Sending...' : 'Send Message'}</Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <MessageStatus
                  error={error}
                  success={messageSendSuccess}
                  onClose={clearStatus}
                />
                {sellerInquiry && notLoggedIn && (
                  <p>Please Register or Login to your account first to send messages.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListingDetailPage;