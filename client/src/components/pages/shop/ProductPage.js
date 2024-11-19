import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import mockData from '../../../assets/mockData';
import NavBar from '../../common/navigation/NavBar';
import CartItem from './CartItem';
import Search from '../../common/search/Search';

import ProductList from './ProductList';
import { Icon } from '@iconify/react';
import { FaFilter } from 'react-icons/fa';
import { IoFilterOutline } from 'react-icons/io5';

import './ProductPage.scss';

const ProductPage = () => {
    const location = useLocation();

    const navigate = useNavigate();


    return (
        <div className="product-screen">
            <NavBar />
            <CartItem />

            <div className="search-input-container">
                     
                <Search
                   
                />
            </div>


    
        </div>
    );
};

export default ProductPage;