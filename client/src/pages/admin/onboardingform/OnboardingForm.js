import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startOnboarding } from '../../../store/slices/OnboardingSlice'; // Start onboarding action
import Button from '../../../components/common/button/Button';
import Input from '../../../components/common/input/Input';
import './Onboarding.scss';

const OnboardingForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.onboarding);

  const [formData, setFormData] = useState({
    instituteName: '',
    instituteType: 'TVET', // Default option
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
        return; // Handle password mismatch
    }

    try {
      // Pass only the required data for onboarding
      await dispatch(startOnboarding({
          instituteName: formData.instituteName, // This should match the registered institute
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          password: formData.password
      })).unwrap();
      
      // After successful onboarding, redirect to document upload
      navigate('/admin/documents', {
        state: { message: 'Please upload required documents to complete onboarding.' }
      });
    } catch (err) {
      console.error('Onboarding failed:', err);
    }
};


  return (
    <div className="onboarding-form">
      <h2>Admin Onboarding</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="form__error">{error}</div>}

        <h3>Institute Information</h3>
        <Input
          label="Institute Name"
          name="instituteName"
          value={formData.instituteName}
          onChange={handleChange}
          required
        />
        <select
          name="instituteType"
          value={formData.instituteType}
          onChange={handleChange}
          className="onboarding-form__select"
          required
        >
          <option value="TVET">TVET</option>
          <option value="College">College</option>
          <option value="University">University</option>
          <option value="Online Platform">Online Platform</option>
        </select>

        <h3>Admin Information</h3>
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
          label="Position"
          name="position"
          value={formData.position}
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

        <Button type="submit" disabled={loading}>
          {loading ? 'Onboarding...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
};

export default OnboardingForm;
