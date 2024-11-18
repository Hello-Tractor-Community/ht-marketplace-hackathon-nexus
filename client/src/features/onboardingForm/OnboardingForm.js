import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateBusiness } from '../../store/slices/OnboardingSlice';
import { completeOnboarding } from '../../store/slices/OnboardingSlice';
import Button from '../../common/button/Button';
import Input from '../../components/Input';
import './Onboarding.scss';

const OnboardingForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // error and loading states
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const { businessId } = location.state || {};

  const [formData, setFormData] = useState({
    // Product Categories
    productCategories: [],
    targetCustomers: [],
    
    // Business Metrics
    currentAnnualRevenue: '',
    productionScale: '',
    productionFrequency: '',
    averageOrderValue: '',
    
    // Platform Expectations
    platformExpectations: [],
    workDescription: '',
    
    // Social Media
    website: '',
    instagram: '',
    facebook: '',
    twitter: '',
    etsy: '',
    pinterest: '',
    
    // Shipping Policies
    domesticShipping: {
      available: false,
      methods: [],
      processingTime: '',
      freeShippingThreshold: ''
    },
    internationalShipping: {
      available: false,
      countries: [],
      methods: [],
      processingTime: ''
    }
  });

  const craftSkillOptions = [
    'Woodworking', 'Ceramics', 'Textile Arts', 'Jewelry Making', 
    'Leather Crafting', 'Metal Work', 'Glass Blowing', 
    'Paper Crafts', 'Digital Design', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle multi-select fields
    if (type === 'checkbox') {
      if (name === 'secondaryCraftSkills') {
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
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return false;
    }

    // Ensure contact information is provided
    if (!formData.email && !formData.phone) {
      alert('Please provide either an email or phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Update business with additional details
      await dispatch(updateBusiness({
        businessId,
        updates: {
          productCategories: formData.productCategories,
          targetCustomers: formData.targetCustomers,
          businessMetrics: {
            currentAnnualRevenue: formData.currentAnnualRevenue,
            productionScale: formData.productionScale,
            productionFrequency: formData.productionFrequency,
            averageOrderValue: formData.averageOrderValue
          },
          platformExpectations: formData.platformExpectations,
          workDescription: formData.workDescription,
          socialMedia: {
            website: formData.website,
            instagram: formData.instagram,
            facebook: formData.facebook,
            twitter: formData.twitter,
            etsy: formData.etsy,
            pinterest: formData.pinterest
          },
          shippingPolicies: {
            domesticShipping: formData.domesticShipping,
            internationalShipping: formData.internationalShipping
          }
        }
      })).unwrap();

      // Complete onboarding
      await dispatch(completeOnboarding(businessId)).unwrap();

      // Navigate to dashboard
      navigate('/business/dashboard');
      // navigate('/admin/documents');
    } catch (error) {
      console.error('Onboarding completion failed:', error);
    }
  };

  return (
    <div className="onboarding-form">
      <h2>Artisan Vendor Account Setup</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="form__error">{error}</div>}

        {/* Personal Information */}
        <div className="form-section">
          <h3>Primary Contact Details</h3>
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
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="auth-form__select"
          >
            <option value="">Select Your Role</option>
            <option value="Maker">Maker/Artisan</option>
            <option value="Owner">Business Owner</option>
            <option value="Manager">Shop Manager</option>
            <option value="Collaborator">Team Collaborator</option>
          </select>
        </div>

        {/* Craft Specialization */}
        <div className="form-section">
          <h3>Craft Expertise</h3>
          <select
            name="primaryCraftSkill"
            value={formData.primaryCraftSkill}
            onChange={handleChange}
            required
            className="auth-form__select"
          >
            <option value="">Select Primary Craft Skill</option>
            {craftSkillOptions.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>

          <div className="full-width">
            <label>Additional Craft Skills (Optional)</label>
            <div className="checkbox-group">
              {craftSkillOptions.map(skill => (
                <label key={skill} className="checkbox-label">
                  <input
                    type="checkbox"
                    name="secondaryCraftSkills"
                    value={skill}
                    checked={formData.secondaryCraftSkills.includes(skill)}
                    onChange={handleChange}
                  />
                  {skill}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Account Management Preferences */}
        <div className="form-section">
          <h3>Account Management</h3>
          <select
            name="preferredCommunicationMethod"
            value={formData.preferredCommunicationMethod}
            onChange={handleChange}
            required
            className="auth-form__select"
          >
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
            <option value="Both">Both Email and Phone</option>
          </select>

          <select
            name="availabilityForSupport"
            value={formData.availabilityForSupport}
            onChange={handleChange}
            required
            className="auth-form__select"
          >
            <option value="">Select Availability for Support</option>
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
            <option value="Anytime">Anytime</option>
            <option value="Limited">Limited Availability</option>
          </select>
        </div>

        {/* Security Section */}
        <div className="form-section">
          <h3>Account Security</h3>
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
          <div className="password-requirements">
            <p>Password must:</p>
            <ul>
              <li>Be at least 8 characters long</li>
              <li>Include at least one uppercase letter</li>
              <li>Include at least one number</li>
              <li>Include at least one special character</li>
            </ul>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="form-section">
          <div className="terms-checkbox">
            <input
              type="checkbox"
              name="acceptTerms"
              required
            />
            <label>I agree to the Terms of Service and Privacy Policy</label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="button-container">
          <Button type="submit" disabled={loading}>
            {loading ? 'Setting Up Account...' : 'Complete Setup'}
          </Button>
        </div>

        {error && <div className="form__error">{error}</div>}
      </form>
    </div>
  );
};

export default OnboardingForm;