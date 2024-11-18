import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import mockData from '../../assets/mockData';
import NavBar from '../../common/navbar/NavBar';
import CartItem from '../../components/CartItem';
import Search from '../../components/Search';

import ProductList from '../../components/ProductList';
import { Icon } from '@iconify/react';
import { FaFilter } from 'react-icons/fa';
import { IoFilterOutline } from 'react-icons/io5';

import './ProductPage.scss';

const ProductPage = () => {
    const location = useLocation();
    const { category, subCategory } = location.state || {};
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [searchResult, setSearchResult] = useState(false);
    const [errorResults, setErrorResults] = useState(false);
    const errorResultsMessage = "No results found. Please search again.";

    const [filteredData, setFilteredData] = useState([]);
    const [filtersMain, setFiltersMain] = useState([]);
    const [filterOption, setFilterOption] = useState('all');
    const [subFilterOption, setSubFilterOption] = useState(false);

    const [filters, setFilters] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const [isFilterVisible, setIsFilterVisible] = useState(false);


    const handleNavigateItem = (item) => {
        navigate('/productDetail', {
            state: {

                item: item,
            }

        });
    };



    const findFilteredItems = (data, booleanFilters) => {
        const matchingItems = [];

        for (const category in data) {
            if (data.hasOwnProperty(category)) {
                const subCategories = data[category];
                for (const subCategory in subCategories) {
                    if (subCategories.hasOwnProperty(subCategory)) {
                        const items = subCategories[subCategory];
                        if (Array.isArray(items)) {
                            for (const item of items) {
                                let matchesAllFilters = true;
                                for (const filter of booleanFilters) {
                                    if (!item[filter]) {
                                        matchesAllFilters = false;
                                        break;
                                    }
                                }
                                if (matchesAllFilters) {
                                    matchingItems.push(item);
                                }
                            }
                        }
                    }
                }
            }
        }

        return matchingItems;
    };

    useEffect(() => {
        const booleanFilters = Object.keys(filters).filter(filterName =>
            typeof filters[filterName] === 'boolean' && filters[filterName]
        );
        if (booleanFilters.length > 0) {
            setSubFilterOption(true);
            setFilteredData(findFilteredItems(mockData, booleanFilters));
        }
    }, [filters]);

    useEffect(() => {
        // console.log('filteredData', filteredData);
    }, [filteredData]);

    const filterNames = {
        priceRange: 'Price Range',
        rating: 'Rating',
        type: 'all',
        isFeatured: 'Featured',
        isNewArrivals: 'New Arrivals',
        isCollections: 'Collections',
        isBanner: 'Banner',
        isPrintOnDemand: 'Print On Demand',
    };

    const handleSliderChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: {
                ...prevFilters[filterName],
                min: Math.min(value, prevFilters[filterName].max),
                max: Math.max(value, prevFilters[filterName].min),
            },
        }));
    };

    const handleSwitchChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value,
        }));
    };

    const categoryTitles = {
        fashion: 'Fashion',
        homeDecor: 'Home Decor',
        hobbyLeisure: 'Hobby & Leisure',
    };

    useEffect(() => {
        let tempData;

        // console.log('category', category, 'subCategory', subCategory);

        if (searchText) {
            tempData = searchMockData(mockData, searchText);
        } else {
            if (subCategory === 'all') {
                tempData = Object.keys(mockData[category])
                    .filter(key => key !== 'filters')
                    .reduce((acc, key) => {
                        acc[key] = mockData[category][key];
                        return acc;
                    }, {});
            } else {
                tempData = mockData[category][subCategory];
            }

            const categoryFilters = mockData[category]?.filters || {};
            const subCategoryFilters = mockData[category]?.[subCategory]?.filters || {};
            setFilters({ ...categoryFilters, ...subCategoryFilters });
        }

        // console.log('tempData', tempData);
        setFilteredData(tempData);
        const keys = Object.keys(mockData[category]).filter(key => key !== 'filters');
        setFiltersMain(['all', ...keys]);
        setFilterOption('all');
    }, [category, subCategory, searchText]);

    useEffect(() => {
        if (filteredData.length === 0) {
            setTimeout(() => {
                setErrorResults(true);
            }, 300);
        } else {
            setErrorResults(false);
        }
    }, [filteredData]);

    const searchMockData = (data, keyword) => {
        let results = [];

        const traverse = (node) => {
            if (node && typeof node === 'object') {
                if (Array.isArray(node)) {
                    node.forEach(item => {
                        if (item.name?.toLowerCase().includes(keyword.toLowerCase()) ||
                            item.description?.toLowerCase().includes(keyword.toLowerCase())) {
                            setSearchResult(true);
                        }
                    });
                } else {
                    Object.entries(node).forEach(([key, value]) => {
                        if (key.toLowerCase().includes(keyword.toLowerCase())) {
                            setSearchResult(true);
                            results.push(value);
                        }
                        traverse(value);
                    });
                }
            }
        };

        traverse(data);
        return results;
    };

    const handleSearch = (text) => {
        if (text.length < 2) {
            setSearchText('');
            if (text.length > 0) {
                setFilteredData([]);
            } else {
                setSearchResult(false);
            }
        } else {
            setSearchText(text);
        }
    };

    const filterData = (filter, category) => {
        setSearchResult(false);
        if (filter === 'all') {
            const tempData = Object.keys(mockData[category])
                .filter(key => key !== 'filters')
                .reduce((acc, key) => {
                    acc[key] = mockData[category][key];
                    return acc;
                }, {});

            setFilteredData(tempData);
        } else {
            // console.log('filter..', filter);
            // console.log('category..', category);
            const filtered = {};
            if (mockData[category] && mockData[category][filter]) {
                filtered[category] = {
                    [filter]: mockData[category][filter]
                };
            }
            setFilteredData(filtered);
            // console.log('filteredData', filteredData);
        }
    };

    useEffect(() => {
        if (filterOption) {
            filterData(filterOption, category);
            // console.log('filterOption', filterOption);

        }
    }, [filterOption]);

    const categories = ['Fashion', 'Home Decor', 'Hobby & Leisure'];

    const toggleOverlay = () => {
        setIsVisible(!isVisible);
    };

    const selectCategory = (categoryTitle) => {
        const category = Object.keys(categoryTitles).find(key => categoryTitles[key] === categoryTitle);
        navigate(`/category/${category}/all`);
        setIsVisible(false);
    };

    const changeFiltersMain = (option) => {
        const lowercaseOption = option.toLowerCase();
        if (lowercaseOption === 'all') {
            setFilteredData(mockData);
        } else {
            const filtered = {};
            filtered[category] = {
                [lowercaseOption]: mockData[category][lowercaseOption]
            };
            setFilteredData(filtered);
            console.log('filteredData..',filteredData);
        }
        setFilterOption(lowercaseOption);
    };

    return (
        <div className="product-screen">
            <NavBar />
            <CartItem />

            <div className="search-input-container">
                <button className="menu-button" onClick={toggleOverlay}>
                    <Icon icon="menu" size={25} color="#75A358" />
                </button>
                {isVisible && (
                    <div className="overlay">
                        {categories.map((cat, index) => (
                            <button
                                key={index}
                                className="category-button"
                                onClick={() => selectCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
                <Search
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    handleSearch={handleSearch}
                />
            </div>

            <div className="button-container">
                {filtersMain.length > 0 && (
                    filtersMain.map((key, index) => (
                        <button
                            key={index}
                            onClick={() => changeFiltersMain(key.toLowerCase())}
                            className={`filter-button ${filterOption === key.toLowerCase() ? 'active' : ''}`}
                        >
                            {key}
                        </button>
                    ))
                )}
            </div>

            <button
                className='filter-button'
                onClick={() => setIsFilterVisible(!isFilterVisible)}
            >
                {isFilterVisible ?
                    <FaFilter size={25} color="#75A358" /> :
                    <IoFilterOutline size={25} color="#75A358" />
                }
            </button>

            {isFilterVisible && (
                <div className="filter-container">
                    {Object.entries(filters)
                        .filter(([filterName]) => filterName !== 'type')
                        .map(([filterName, filterValues]) => (
                            <div key={filterName} className="filter-section">
                                <h3 className="filter-title">{filterNames[filterName]}</h3>
                                {typeof filterValues === 'boolean' ? (
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={filterValues}
                                            onChange={(e) => handleSwitchChange(filterName, e.target.checked)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                ) : Array.isArray(filterValues) ? (
                                    filterValues.map((value) => (
                                        <button key={value} className="filter-value">
                                            {value}
                                        </button>
                                    ))
                                ) : (
                                    <div className="slider-container">
                                        <p>{`Range: ${filterValues.min} - ${filterValues.max}`}</p>
                                        <Slider
                                            min={filterValues.min}
                                            max={filterValues.max}
                                            step={1}
                                            onChange={(value) => handleSliderChange(filterName, value)}
                                            value={filterValues.min}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            )}

            {filteredData && !searchResult && (
                <div style={{ width: '100%' }}>
                    <h2 className="main-category-title">{categoryTitles[category]}</h2>
                    <ProductList category=  {category} title={filterOption} data={filteredData} />
                </div>
            )}

            {filteredData && (subFilterOption || searchResult) && (
                <div className="product-grid">
                    {Object.values(filteredData).map((item) => (

                        <div key={item.id} className="product-item" onClick={() => handleNavigateItem(item)}>
                            <img src={item.images[0].source} alt={item.name} className="product-image" />
                            <div className="product-info">
                                <h3 className="product-name">{item.name}</h3>
                                <p className="product-price">{item.priceUnit} {item.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredData.length === 0 && errorResults && (
                <div className="no-results-container">
                    <p className="no-results-text">{errorResultsMessage}</p>
                </div>
            )}
        </div>
    );
};

export default ProductPage;