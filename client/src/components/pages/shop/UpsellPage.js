import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BreadCrumb from '../../BreadCrumb';
import NavBar from '../../common/navbar/NavBar';
import CartItem from './CartItem';
import StarRating from './StarRating';
import { AppContext } from '../../AppContext';
import mockData from '../../../assets/mockData';
import './UpsellPage.scss';

const UpsellPage = () => {
  const location = useLocation();

  const item = location.state.item || null;

  const navigate = useNavigate();
  const { addToCart, setUpsellShown } = useContext(AppContext);
  const breadcrumbItems = ['Home', 'Products', 'Upsell', item.name];
  
  const [currentImage, setCurrentImage] = useState(item.images[0].source);

  const addToCartAndNavigate = (item) => {
    addToCart(item);
    navigate('/cart');
  };

  useEffect(() => {
    setUpsellShown(true);
  }, []);

  return (
    <div className="upsell-screen">
      <NavBar />
      <CartItem />
      <div className="header-container">
        <button onClick={() => navigate(-1)} className="back-button">
          <i className="ionicon ionicon-arrow-back"></i>
        </button>
        {/* <BreadCrumb items={breadcrumbItems} /> */}
      </div>
      <h1 className="title">We thought you might like this</h1>
      {item && (
        <div className="product-container">
          <div className="image-container">
            <div className="main-image-container">
              <img src={currentImage} alt={item.name} className="main-image" />
            </div>
            <div className="smaller-images-container">
              {item.images.map((img, index) => (
                <button key={index} onClick={() => setCurrentImage(img.source)}>
                  <img src={img.source} alt={`${item.name} ${index + 1}`} className="smaller-image" />
                </button>
              ))}
            </div>
          </div>

          <div className="info-container">
            <h2 className="name">{item.name}</h2>
            <p className="description">{item.description}</p>
            <p className="price">{item.priceUnit} {item.price.toFixed(2)}</p>
            <p className="rating">
              Rating: {item.rating} ({item.reviews} reviews)
              <StarRating rating={item.rating} />
            </p>
          </div>

          <div className="cta-container-upsell">
            <button className="button add-to-cart" onClick={() => addToCartAndNavigate(item)}>
              Add to Cart
            </button>

            <button
              className="button skip"
              onClick={() => navigate('/cart')}
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpsellPage