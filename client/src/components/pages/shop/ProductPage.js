import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import mockData from '../../../assets/mockData';
import NavBar from '../../common/navigation/NavBar';
import CartItem from './CartItem';
import Search from '../../common/search/Search';
import Card from '../../common/card/Card';

import ProductList from './ProductList';
import { Icon } from '@iconify/react';
import { FaFilter } from 'react-icons/fa';
import { IoFilterOutline } from 'react-icons/io5';

import './ProductPage.scss';
import './ProductPage.css'


const ProductPage = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch data from the mock API
    const fetchListings = async () => {
      try {
        const response = await fetch('http://localhost:8000/listings'); // Adjust the URL if needed
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

    return (
        <div className="product-screen">
            <NavBar />
            <CartItem />

            <div className="search-input-container">     
                <Search/> 
            </div>

            {/* <div className={style.container}>
                <h1>Listings</h1>
                <div className={style.cardGrid}>
                    {listings.map((listing) => (
                    <div key={listing.sku} className={style.card}>
                        {listing.images.length > 0 && (
                        <img
                            src={listing.images[0].url}
                            alt={listing.images[0].alt}
                            className={style.cardImage}
                        />
                        )}
                        <div className={style.cardBody}>
                        <h2 className={style.cardTitle}>{listing.name}</h2>
                        </div>
                    </div>
                    ))}
                </div>
            </div> */}

<div className="card__group">
  {listings.map((listing) => (
    <div key={listing.sku} className="card">
      <div className="card__image">
        {listing.images.length > 0 && (
          <img
            src={listing.images[0].url}
            alt={listing.images[0].alt || "Listing image"}
          />
        )}
      </div>
      <div className="card__content">
        <h1>{listing.name}</h1>
        <p>
          {listing.description ||
            "No description available for this listing."}
        </p>
        <a href="#">
          Learn more
          <i className="fa-solid fa-chevron-right icon"></i>
        </a>
      </div>
    </div>
  ))}
</div>
    
        </div>
    );
};

export default ProductPage;