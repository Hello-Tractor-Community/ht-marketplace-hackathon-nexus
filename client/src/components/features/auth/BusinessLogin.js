// src/components/features/auth/BusinessLogin.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../store/slices/authSlice';
import Button from '../../common/button/Button';
import Input from '../../components/Input';

const BusinessLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);
  
    const [formData, setFormData] = useState({
      email: '',
      password: ''
    });
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await dispatch(loginUser(formData)).unwrap();
  
        if (!response.success) {
          throw new Error(response.message);
        }
        navigate('/admin/dashboard');
      } catch (err) {
        console.error('Registration failed:', error);
    };
  
    return (
      <div className="auth-form">
        <h2>Business Admin Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="auth-form__error">{error}</div>}
          
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
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
  
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    );
  };
}

  export default BusinessLogin; 
  