import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerBusiness } from '../../../store/slices/authSlice';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import NavBar from '../../../components/NavBar';
import './BusinessRegister.scss';


const BusinessRegister = ({ history }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    // Business Details
    businessName: '',
    businessOwner: '',
    businessType: 'Freelance',
    productCategories: [],
    
    // Contact Information
    email: '',
    phone: '',
    
    // Product Details
    primaryProducts: '',
    targetCustomers: [],
    currentAnnualRevenue: '',
    
    // Business Goals
    platformExpectations: [],
    
    // Additional Context
    yearsActive: '',
    workDescription: '',
    
    // Production Details
    productionScale: 'Small',
    productionFrequency: '',
    
    // Compliance & Verification
    taxId: '',
    isRegisteredBusiness: false
  });

  const productCategoryOptions = [
    'Fashion Accessories', 'Clothing', 'Home Decor', 
    'Jewelry', 'Ceramics', 'Woodwork', 'Textiles', 
    'Artwork', 'Leather Goods', 'Other'
  ];

  const targetCustomerOptions = [
    'Luxury Shoppers', 'Budget Conscious', 'Eco-Friendly Consumers', 
    'Art Collectors', 'Home Decorators', 'Gift Shoppers', 
    'Sustainable Fashion Enthusiasts'
  ];

  const platformExpectationOptions = [
    'Increased Visibility', 'Sales Growth', 'Marketing Support', 
    'Payment Processing', 'Community Networking', 
    'Professional Development', 'Logistics Support'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle multi-select fields
    if (type === 'checkbox') {
      if (name === 'productCategories' || name === 'targetCustomers' || name === 'platformExpectations') {
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...(prev[name] || []), value]
            : (prev[name] || []).filter(item => item !== value)
        }));
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    // Ensure at least one contact method is provided
    if (!formData.email && !formData.phone) {
      alert('Please provide either an email or phone number');
      return false;
    }

    // Ensure at least one product category is selected
    if (formData.productCategories.length === 0) {
      alert('Please select at least one product category');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const registrationData = {
      businessName: formData.businessName,
      owner: formData.businessOwner,
      businessType: formData.businessType,
      productCategories: formData.productCategories,
      contactEmail: formData.email,
      contactPhone: formData.phone,
      primaryProducts: formData.primaryProducts,
      targetCustomers: formData.targetCustomers,
      currentAnnualRevenue: formData.currentAnnualRevenue,
      platformExpectations: formData.platformExpectations,
      yearsActive: formData.yearsActive,
      workDescription: formData.workDescription,
      productionScale: formData.productionScale,
      productionFrequency: formData.productionFrequency,
      taxId: formData.taxId,
      isRegisteredBusiness: formData.isRegisteredBusiness
    };

    try {
      await dispatch(registerBusiness(registrationData)).unwrap();
      navigate('/admin/onboarding');
    } catch (err) {
      // Error is handled by Redux
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="auth-form">
      <NavBar history={history} />
      <h2>Onboard your Artisan & Craft Business</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Business Details Section */}
        <h3>Business Profile</h3>
        <div className="form-section">
          <Input
            label="Business/Brand Name"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
          />
          <Input
            label="Owner Name"
            name="businessOwner"
            value={formData.businessOwner}
            onChange={handleChange}
            required
          />
          
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="auth-form__select"
            required
          >
            <option value="Freelance">Freelance</option>
            <option value="Small Business">Small Business</option>
            <option value="Registered Company">Registered Company</option>
          </select>

          <div className="full-width">
            <label>Product Categories (Select all that apply)</label>
            <div className="checkbox-group">
              {productCategoryOptions.map(category => (
                <label key={category}>
                  <input
                    type="checkbox"
                    name="productCategories"
                    value={category}
                    checked={formData.productCategories.includes(category)}
                    onChange={handleChange}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <h3>Contact Information</h3>
        <div className="form-section">
          <Input
            label="Email (Optional)"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            label="Phone Number (Optional)"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Product & Market Details */}
        <h3>Your Craft & Market</h3>
        <div className="form-section">
          <Input
            label="Primary Products/Services"
            name="primaryProducts"
            value={formData.primaryProducts}
            onChange={handleChange}
            required
          />

          <div className="full-width">
            <label>Target Customers (Select all that apply)</label>
            <div className="checkbox-group">
              {targetCustomerOptions.map(customer => (
                <label key={customer}>
                  <input
                    type="checkbox"
                    name="targetCustomers"
                    value={customer}
                    checked={formData.targetCustomers.includes(customer)}
                    onChange={handleChange}
                  />
                  {customer}
                </label>
              ))}
            </div>
          </div>

          <Input
            label="Current Annual Revenue (Approx. $)"
            type="number"
            name="currentAnnualRevenue"
            value={formData.currentAnnualRevenue}
            onChange={handleChange}
          />

          <select
            name="productionScale"
            value={formData.productionScale}
            onChange={handleChange}
            className="auth-form__select"
          >
            <option value="Small">Small Scale</option>
            <option value="Medium">Medium Scale</option>
            <option value="Large">Large Scale</option>
          </select>
        </div>

        {/* Platform Expectations */}
        <h3>Platform Expectations</h3>
        <div className="form-section full-width">
          <label>What do you hope to achieve? (Select all that apply)</label>
          <div className="checkbox-group">
            {platformExpectationOptions.map(expectation => (
              <label key={expectation}>
                <input
                  type="checkbox"
                  name="platformExpectations"
                  value={expectation}
                  checked={formData.platformExpectations.includes(expectation)}
                  onChange={handleChange}
                />
                {expectation}
              </label>
            ))}
          </div>
        </div>

        {/* Additional Context */}
        <h3>Additional Information</h3>
        <div className="form-section">
          <Input
            label="Years Active in Your Craft"
            type="number"
            name="yearsActive"
            value={formData.yearsActive}
            onChange={handleChange}
          />
          
          <div className="full-width">
            <textarea
              name="workDescription"
              value={formData.workDescription}
              onChange={handleChange}
              placeholder="Brief description of your work and unique selling points"
              className="auth-form__textarea"
              maxLength={1000}
            />
          </div>
        </div>

        {/* Submission */}
        <div className="button-container">
          <Button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register Business'}
          </Button>
        </div>

        {error && <div className="auth-form__error">{error}</div>}
      </form>
    </div>
  );
};

export default BusinessRegister;