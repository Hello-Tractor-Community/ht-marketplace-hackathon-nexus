import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import mockData from '../../../assets/mockData';
import NavBar from '../../../common/navigation/NavBar';
import Search from '../../../components/Search';
import SubNiche from '../../features/SubNiche';
import Prompt from '../../../components/Prompt';
import Create from '../create/Create';
import Business from '../business/Business';
import About from '../about/About';
import ProductCategory from '../../../components/ProductCategory';
import StarRating from '../../../components/StarRating';
import CartItem from '../../../components/CartItem';
import './Home.scss';

const Home = ({ history }) => {
    const [sectionsPromo, setSectionsPromo] = useState([]);
    const [filteredData, setFilteredData] = useState(mockData);
    const [filterOption, setFilterOption] = useState('all');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const filterData = (filter) => {
        let tempData;
        if (filter === 'all') {
            tempData = Object.keys(mockData).reduce((acc, category) => {
                acc[category] = Object.keys(mockData[category]).reduce((subAcc, key) => {
                    if (key !== 'filters') {
                        subAcc[key] = mockData[category][key];
                    }
                    return subAcc;
                }, {});
                return acc;
            }, {});
            setFilteredData(tempData);
        } else {
            const filtered = {};
            Object.keys(mockData).forEach(category => {
                const filteredCategory = {};
                Object.keys(mockData[category]).forEach(subCategory => {
                    if (subCategory === filter) {
                        filteredCategory[subCategory] = mockData[category][subCategory];
                    }
                });
                if (Object.keys(filteredCategory).length > 0) {
                    filtered[category] = filteredCategory;
                }
            });
            setFilteredData(filtered);
        }
    };

    useEffect(() => {
        filterData(filterOption);
    }, [filterOption]);

    const traverseAndFilter = (data) => {
        let filteredItems = [];

        const traverse = (node) => {
            if (node && typeof node === 'object') {
                if (Array.isArray(node)) {
                    node.forEach(item => traverse(item));
                } else {
                    if (node.isBanner === true) {
                        filteredItems.push(node);
                    }
                    Object.values(node).forEach(child => traverse(child));
                }
            }
        };

        Object.values(data).forEach(category => traverse(category));

        return filteredItems;
    };

    useEffect(() => {
        const filteredData = traverseAndFilter(mockData);
        setSectionsPromo(filteredData);
    }, []);

    useEffect(() => {
        if (sectionsPromo.length > 0) {
            const timer = setInterval(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % sectionsPromo.length);
            }, 3000);

            setIsLoading(false);

            return () => clearInterval(timer);
        }
    }, [sectionsPromo]);

    const currentItem = sectionsPromo[currentIndex];
    const handleNavigateItem = (item) => {                        
        navigate('/productDetail', { 
          state: {
    
            item:item,
          }       
          
        });
      };

    return (
        <div className="home">
            <NavBar history={history} />
            <CartItem />
            <Search />
            <SubNiche history={history} />
            <section className="customers-picks">
                <div className="header">
                    <Link to="/section" className="title">Customers' picks</Link>
                    {isLoading && <p>Loading...</p>}
                </div>

                {!isLoading && (
                    <div className="product-container">
                        <div className="promo-container">
                            <div className="promo-image-container"
                             onClick={() => handleNavigateItem(currentItem)}
                             >
                                <img src={currentItem.images[0].source} alt={currentItem.description} className="promo-image" />
                            </div>
                            <div className="promo-text-container">
                                <p className="sub-body">{currentItem.description}</p>
                                <p className="body">
                                    {currentItem.priceUnit} {currentItem.price.toFixed(2)}
                                </p>
                                <div className="sub-body">
                                    <p>Rating: {currentItem.rating} ({currentItem.reviews} reviews)</p>
                                    <StarRating rating={currentItem.rating} />
                                </div>
                                <div onClick={() => handleNavigateItem(currentItem)}
                                    className="see-more">
                                    <span>
                                        GET IT NOW
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <div className="body-cta">
                <div className="gradient">
                    <p>Explore our unique collections, perfect for treating yourself or finding the ideal gifts for friends and family.</p>
                </div>
            </div>

            {filterOption === 'all' && (
                <div className="all-products">
                    {Object.keys(mockData).map((key) => (
                        <ProductCategory key={key} title={key} data={mockData[key]} />
                    ))}
                </div>
            )}

            {filterOption !== 'all' && (
                <div className="filtered-products">
                    {Object.keys(filteredData).map((key) => (
                        <ProductCategory key={key} title={key} data={filteredData[key]} />
                    ))}
                </div>
            )}

            <Prompt />
            <Create />
            <Business />
            <About />
        </div>
    );
};

export default Home;