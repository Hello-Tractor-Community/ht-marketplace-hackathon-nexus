// BusinessRegisterUpdated.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../store/slices/authSlice';
import {authService} from '../../../services/api/auth';
import {registerBusiness} from '../../../store/slices/BusinessSlice';
// import { registerBusiness } from '../../../store/slices/BusinessSlice';
import Button from '../../../common/button/Button';
import Input from '../../../components/Input';
import NavBar from '../../../common/navbar/NavBar';
import './BusinessRegister.scss';

const BusinessRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Essential Business Info
    businessName: '',
    businessType: 'Freelance',
    registrationNumber: '', // Added field
    taxId: '', // Added field

    // Location Info (Added section)
    country: '',
    state: '',
    city: '',
    address: '',
    postalCode: '',

    // Owner Account Info
    firstName: '',
    lastName: '',
    businessRole: 'Owner',
    email: '',
    phone: '', // Added field
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle multi-select fields
    if (type === 'checkbox') {
      if (name === 'businessType' || name === 'businessRole') {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // 1. Register the user first
      const response = await dispatch(registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      }));

      const { success, data } = response.payload;

      console.log("Inside BusinessRegister..");
      

      console.log("sucess..", success);
      console.log("data..", data);

      // Check if we have a successful response with user data
      if (!success || !data?.user?._id) {
        throw new Error(data.error || 'User registration failed');
      }
      console.log('User registration successful:', data);
      const { user, token } = data;
      console.log("user id.. and type of", user._id, typeof user._id);
    
      // Introduce a delay before registering the business
      await new Promise(resolve => setTimeout(resolve, 1000)); // 2000 ms delay (2 seconds)
      // 2. Register the business
      const businessResult = await dispatch(registerBusiness({
        owner: user._id, // Use the user ID from the response
        role: formData.businessRole,
        businessName: formData.businessName,
        businessType: formData.businessType,
        registrationDetails: {
          taxId: formData.taxId,
          businessRegistrationNumber: formData.registrationNumber
        },
        location: {
          country: formData.country,
          state: formData.state,
          city: formData.city,
          address: formData.address,
          postalCode: formData.postalCode
        }
      })).unwrap();

      console.log("Business Result..", businessResult);

      if (!businessResult.success || !businessResult.data?.business?._id) {
        throw new Error(businessResult.error || 'Business registration failed');
      }
      console.log("Business registration successful:", businessResult.data);

      // // 3. Associate user with business
      // const associationResult = await dispatch(addBusinessAssociation({
      //   userId: user._id,
      //   businessId: businessResult.data.business._id,
      //   role: formData.businessRole
      // })).unwrap();

      // if (!associationResult.success) {
      //   throw new Error(associationResult.error || 'Failed to associate user with business');
      // }

       authService.removeToken();
      // 4. Navigate to email verification
      navigate('/email-verification', {
        state: {
          email: formData.email,
          businessId: businessResult.data.business._id
        }
      });

    } catch (error) {
      console.error('Registration failed:', error);
      alert(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="registration-form">
      <NavBar />
      <h2>Register Your Business</h2>
      <form onSubmit={handleSubmit}>
        <section className="business-section">
          <h3>Essential Business Information</h3>
          <Input
            label="Business Name"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
          />
          Business Type
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            required
          >
            <option value="Freelance">Freelance</option>
            <option value="Small Business">Small Business</option>
            <option value="Registered Company">Registered Company</option>
          </select>
          <Input
            label="Business Registration Number (if applicable)"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
          />
          <Input
            label="Tax ID (if applicable)"
            name="taxId"
            value={formData.taxId}
            onChange={handleChange}
          />
        </section>

        <section className="location-section">
          <h3>Business Location</h3>
          <Input
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
          <Input
            label="State/Province"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <Input
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
        </section>

        <section className="owner-section">
          <h3>Owner Account</h3>
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <div className="form-group">
            <label>Business Role</label>
            <select
              name="businessRole"
              value={formData.businessRole}
              onChange={handleChange}
              required
            >
              <option value="owner">Owner</option>
              <option value="founder">Founder</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </section>

        <Button type="submit">Create Account & Continue</Button>
      </form>
    </div>
  );
};

export default BusinessRegister;