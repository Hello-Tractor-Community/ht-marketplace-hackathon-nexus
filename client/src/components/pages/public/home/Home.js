import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import NavBar from '../../../common/navigation/NavBar';

import ListingPage from '../../shop/ListingPage';
import Footer from '../footer/Footer'
import './Home.scss';

const Home = ({ history }) => {
   
    const navigate = useNavigate();

   
    return (
        <div className="home">
            <NavBar history={history} />
            <ListingPage />
       
            <Footer />
        </div>
    );
};

export default Home;