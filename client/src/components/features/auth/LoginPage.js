// src/components/features/auth/LoginPage.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { loginUser } from '../../../store/slices/authSlice';
import Button from '../../common/button/Button';
import Input from '../../common/input/Input';
import NavBar from '../../common/navigation/NavBar';
import LoginSimple from './LoginSimple';
import './Auth.scss';
const LoginPage = () => {
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
        await dispatch(loginUser(formData)).unwrap();
        navigate('/user/dashboard');
      } catch (err) {
        // Error handled by Redux
      }
    };
  
    return (
      <div className="auth-form">        
        <NavBar show={false}/>
        
        <LoginSimple/>
      </div>
    );
  };

  export default LoginPage;
  
  