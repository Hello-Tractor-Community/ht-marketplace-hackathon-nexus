import React from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaYoutube, FaTwitter, FaPhone, FaEnvelope, FaTelegram, FaMapMarkerAlt } from 'react-icons/fa';
import './footer.scss';

const Footer = () => {

    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        navigate('/products-services', { state: { category } });
    };

    const telegramAccount = process.env.REACT_APP_TELEGRAM_ACCOUNT;
    const xAccount = process.env.REACT_APP_X_ACCOUNT;
    const facebookAccount = process.env.REACT_APP_FACEBOOK_ACCOUNT;
    const youtubeAccount = process.env.REACT_APP_YOUTUBE_ACCOUNT;
    const phoneNumber = process.env.REACT_APP_PHONE_NUMBER;


    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-column">
                    <h4>COMPANY</h4>
                    <ul>
                        <li>
                            <Link to="https://hellotractor.com/" className="company-link">Home</Link>
                        </li>
                        <li>
                            <Link to="https://hellotractor.com/team/" className="company-link">Team</Link>
                        </li>
                        <li>
                            <Link to="https://hellotractor.com/blog/" className="company-link">Blog</Link>
                        </li>
                        <li>
                            <Link to="https://hellotractor.com/careers/" className="company-link">Careers</Link>
                        </li>    
                        <li>
                            <Link to="https://hellotractor.com/contact/" className="company-link">Contact</Link>
                        </li>                        
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>SOLUTIONS</h4>
                    <ul>
                        <li>
                            <Link to="https://hellotractor.com/equipment-owners/" className='company-link'>Buy Technology</Link>
                        </li>
                        <li>
                            <Link to="https://hellotractor.com/dealer-pilot/" className='company-link'>Dealer Pilot Program</Link>
                        </li>
                        <li>
                            <Link to="https://hellotractor.com/booking-agent/" className='company-link'>Become a Booking Agent</Link>
                        </li>
                        <li>
                            <Link to="https://hellotractor.com/financing/" className='company-link'>Calculate Equipment Returns</Link>
                        </li>

                    </ul>
                </div>
                <div className="footer-column">
                    <h4>STAY CONNECTED</h4>
                    <ul className="social-icons">
                        <li>
                            <a
                                href={`https://t.me/${telegramAccount}`}
                                target="_blank" rel="noopener noreferrer">
                                <FaTelegram />
                            </a>
                        </li>
                        <li>
                            <a
                                href={`https://www.facebook.com/${facebookAccount}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaFacebook />
                            </a>
                        </li>
                        {/* <li>
                                        <a
                                            href={`https://www.youtube.com/${youtubeAccount}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <FaYoutube />
                                        </a>
                                    </li> */}
                        <li>
                            <a
                                href={`https://www.twitter.com/${xAccount}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaTwitter />
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>CONTACT US</h4>
                    <ul className='grid'>
                        <li className='icon'>
                           <FaMapMarkerAlt />

                        </li>
                        <div className='stack'>
                            <li>Ground Floor, The Address, Muthangari Drive, Westlands, Nairobi, Kenya.</li>
                            <li>2nd Floor, 20A Gana Street, Maitama, Abuja, Nigeria</li>
                            <li>Hello Tractor Uganda Bukoto Mukalazi Road Kampala-Uganda</li>
                        </div>
                    </ul>
                    <ul className='grid'>
                        <li className='icon'>
                           <FaPhone />

                        </li>
                        <div className='stack'>
                            <li>+254 (0) 706 492 729 </li>
                            <li> +234 700 123 5355 </li>
                            <li>+256 757 000 004</li>
                        </div>
                        
                    </ul>
                    <ul className='grid'>
                    <li className='icon'>
                       <FaEnvelope />
                        </li>
                        <li>hello@hellotractor.com</li>
                    </ul>
                </div>
            </div >
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} hellotractor. All rights reserved.</p>
            </div>

        </footer >
    );
};

export default Footer;