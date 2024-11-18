import React, { useEffect, useState } from 'react';
import './admin-products.css'; // Import CSS file for styling
import { useAppContext } from './AppContext';

import { FaEye, FaEyeSlash, FaCopy, FaTrash } from 'react-icons/fa';
import axios from 'axios';

import UploadWidgetClaudinary from './UploadWidgetClaudinary';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
// const API_URL = 'https://api-netconn.brosfe.com';
const AdminProducts = () => {
  const { currentLanguage } = useAppContext();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    image: '', name: '', description: '',
    price: {
      current: '',
      past: [],
    }, modelNumber: '', features: '', stock: '', isFeatured: false,
  });
  const [isClipboardCopied, setIsClipboardCopied] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchProducts();
    }
  }, []);

  const [originalUrl, setOriginalUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');


  const convertUrl = () => {
    // Regular expression to extract the file ID from the original URL
    const fileIdMatch = originalUrl.match(/https:\/\/drive\.google\.com\/file\/d\/(.+?)\/view/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      // Construct the converted URL in thumbnail format
      const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}`;
      setConvertedUrl(thumbnailUrl);
    } else {
      setConvertedUrl('Invalid URL');
    }
  };

  // Function to copy the converted URL to the clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedUrl)
      .then(() => {
        // alert('Converted URL copied to clipboard!');
        setIsClipboardCopied(true);
      })
      .catch(() => {
        alert('Failed to copy the URL');
      });
  };

  useEffect(() => {
    if (isClipboardCopied) {
      setTimeout(() => {
        setIsClipboardCopied(false);
      }, 1000);
    }
  }, [isClipboardCopied]);

  const fetchProducts = async () => {
    const response = await axios.get(`${API_URL}/api/products`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    setProducts(response.data);
    setIsLoading(false);
  };
  const handleProductChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('authToken');
      console.log('Auth Token:', authToken); // Add this line to log the token

      await axios.post(`${API_URL}/api/products`, newProduct, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setNewProduct({
        image: '',
        name: '',
        description: '',
        price: { current: '', past: [] },
        modelNumber: '',
        features: '',
        stock: '',
        isFeatured: false,
      });
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleProductDelete = async (id) => {
    await axios.delete(`${API_URL}/api/products/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    fetchProducts();
  };

  const [isFeatureChecked, setIsFeatureChecked] = useState(false);

  const handleToggle = () => {
    setIsFeatureChecked(!isFeatureChecked);
    setNewProduct({ ...newProduct, isFeatured: !isFeatureChecked });
  };

  return (
    < >
      {currentLanguage === 'English' && (

        <div className='sub-container'>

         
          <div className='admin-product-controller'>
          
         
            <div className='admin-content-form'>
            <h3>Add new product</h3>
           

              <form onSubmit={handleProductSubmit}>

                <input
                  type="text"
                  name="image"
                  placeholder="Image URL"
                  value={newProduct.image}
                  onChange={handleProductChange}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={handleProductChange}
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Current Price"
                  value={newProduct.price.current}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: {
                        ...newProduct.price,
                        current: parseFloat(e.target.value),
                      },
                    })
                  }
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Past Price"
                  value={newProduct.price.past[0]?.price || ''}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: {
                        ...newProduct.price,
                        past: [{ price: parseFloat(e.target.value), date: new Date() }],
                      },
                    })
                  }
                />
                <input
                  type="text"
                  name="modelNumber"
                  placeholder="Model number"
                  value={newProduct.modelNumber}
                  onChange={handleProductChange}
                />
                <input
                  type="text"
                  name="features"
                  placeholder="Features"
                  value={newProduct.features}
                  onChange={handleProductChange}
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock count"
                  value={newProduct.stock}
                  onChange={handleProductChange}
                />
                   <textarea
                  name="description"
                  placeholder="Product Description"
                  value={newProduct.description}
                  onChange={handleProductChange}
                ></textarea>
                <div className='featured'>
                  <p>Featured</p>
                  <div className="toggle-container" onClick={handleToggle}>


                    <div className={`toggle-button ${isFeatureChecked ? 'checked' : ''}`}>

                      <div className="toggle-slider" />
                    </div>
                  </div>
                </div>


                <button type="submit">Send to Database</button>
              </form>


            </div>
            <div className='admin-cloudinary-container'>
              <UploadWidgetClaudinary folderName='products'/>
            </div>
          </div>

          <div className='products-table'>
            {isLoading && <p>Loading...</p>}
            <h4>Products on database</h4>
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price|current|</th>
                  <th>Price|past|</th>
                  <th>Model #</th>
                  <th>Features</th>
                  <th>Stock</th>
                  <th>isFeatured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td><img src={product.image} alt={product.name} /></td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price.current}</td>
                    <td>{product.price.past[0].price}</td>
                    <td>{product.modelNumber}</td>
                    <td>{product.features}</td>
                    <td>{product.stock}</td>
                    <td>{product.isFeatured}</td>
                    <td>
                      <button onClick={() => handleProductDelete(product._id)}><FaTrash /> </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>





        </div>

      )}
      {currentLanguage === 'አማርኛ' && (
        <div className='sub-container'>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1>መነሻ ገጽ</h1>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProducts;