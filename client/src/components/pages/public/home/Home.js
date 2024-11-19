import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import NavBar from '../../../common/navigation/NavBar';
import Search from '../../../common/search/Search';
import Prompt from '../../shop/Prompt';
import About from '../about/About';
import StarRating from '../../shop/StarRating';
import CartItem from '../../../components/CartItem';
import './Home.scss';

const Home = ({ history }) => {
   
    const navigate = useNavigate();

   
    return (
        <div className="home">
            <NavBar history={history} />
            <CartItem />
            <Search />
           
            <div className="body-cta">
                <div className="gradient">
                    <p>Explore our unique collections, perfect for treating yourself or finding the ideal gifts for friends and family.</p>
                </div>
            </div>

          

            <Prompt />          
            <About />
        </div>
    );
};

export default Home;