import React from 'react';
import { useNavigate } from 'react-router-dom';

import NavBar from '../../../common/navigation/NavBar';
import Button from '../../../common/button/Button';
import Footer from '../footer/Footer';

import './Service.scss';

const Service = () => {

    const navigate = useNavigate();


    const handleContinueShopping = () => {

        navigate('/home', { replace: true });
    };

    const dealers = {
        cmc: [
            { location: "Nairobi", phone: "722283433", address: "Lusaka Rd" },
            { location: "Nakuru", phone: "722316821", address: "Nakuru Kisumu Rd" },
            { location: "Nanyuki/Meru", phone: "727443226", address: "Sagana Rd" },
            { location: "Eldoret/Kitale", phone: "723256074", address: "Eldoret Kisumu Rd" },
            { location: "Kisumu", phone: "722540558", address: "Obote Rd" },
            { location: "Mombasa", phone: "720661972", address: "Archbishop Makarios Rd, Mombasa" },
        ],
        mascor: [
            { location: "Eldoret", phone: "254 207 602 298", address: "Uganda Rd" },
            { location: "Kisumu", phone: "254 207 602 294", address: "Obote Road, Kisumu" },
            { location: "Nakuru", phone: "254 207 602 288", address: "Old Nairobi Road, Nakuru" },
            { location: "Narok", phone: "254 720 935 034", address: "Narok" },
        ],
        cfaoMotors: [
            { location: "Nakuru", phone: "207604121", address: "Town East, George Morara Rd, Nakuru" },
            { location: "Kisumu", phone: "719029707", address: "" },
            { location: "Nantuki", phone: "0719 029462", address: "Kenyatta Rd" },
        ],
        cadsMotors: [
            { location: "Kericho", phone: "254 708 698 899", address: "Moi Highway" },
        ],
        sicheyAutomotive: [
            { location: "Nairobi", phone: "254 735 500 500 / +254 768 989 407 / +254 757 487 425", address: "Pembe Plaza, Ground Floor Homa Bay Road/ Enterprise Road Junction Industrial Area" },
        ],
        terranovaAutomotive: [
            { location: "Bungoma", phone: "254 777 222 239", address: "Webuye Malaba Road – Kandunyi" },
        ],
        uniTruckWorld: [
            { location: "Nakuru", phone: "254 727 228 811 / +254 734 228 811 / +254 512216045", address: "George Morara Avenue Next To Bhogals Toyota" },
        ],
        fmd: [
            { location: "Nakuru", phone: "722205538", address: "Town East, Biashara George Morara Ave Nakuru, Kiambu" },
            { location: "Eldoret", phone: "727509018", address: "Lima Hse Kapseret, Kipkenyo, Kenyatta ave, Eldore" },
        ],
    };

    const dealerNames = {
        cmc:"CMC - New Holland Dealer",
        mascor:"Mascor - John Deere",
        cfaoMotors:"CFAO Motors - Case HI Dealer",
        cadsMotors: "CADS Motors (Kericho Toyota)",
        sicheyAutomotive: "Sichey Automotive EA Ltd",
        terranovaAutomotive: "Terranova Automotive",
        uniTruckWorld: "Uni-Truck World Ltd",
        fmd: "FMD"

    }



    return (
        <div className='services-container'>
            <NavBar />
            <div className='main-container'>
            <h2>Service centers</h2>
            <p>Contact these service centers to find tractor parts and tractor operators.</p>
           
                {Object.keys(dealers).map((key) => (
                    <div key={key} className='dealer'>
                        <h3>{dealerNames[key]}</h3>
                        <div>
                        {dealers[key].map((dealer, index) => (
                            <div key={index}>
                                <p>Location - {dealer.location}</p>
                                <p>Phone - {dealer.phone}</p>
                                <p>Address - {dealer.address}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                ))}

            </div>


            <Button variant='secondary' onClick={handleContinueShopping}>
                Continue to Store
            </Button>

            <Footer/>

        </div>
    );
};

export default Service;
