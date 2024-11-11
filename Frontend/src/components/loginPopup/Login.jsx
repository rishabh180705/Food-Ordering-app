import React, { useState, useContext } from 'react';
import './Login.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/frontend_assets/assets';
import { StoreContext } from '../../context/storeContext';

const Login = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState('Sign up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    const endpoint = currState === 'Sign up' ? '/api/user/register' : '/api/user/login';
  
  
    try {
      const response = await axios.post(`${url}${endpoint}`, { name, email, password }, { withCredentials: true });
      console.log('API response:', response.data);
  
      if (response.data.success) {
        
        setToken(cookieStore.get('token'));
        localStorage.setItem('token', JSON.stringify());
        toast.success(response.data.message);
        setShowLogin(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Caught error:', error); // Full error details
      if (error.response) {
        console.error('API error response:', error.response.data); // Detailed response
        toast.error(error.response.data.message || 'An error occurred. Please try again.');
      } else {
        console.error('Error message:', error.message); // Generic error message
        toast.error('Network error. Please check your connection and try again.');
      }
    }
  };
  

  return (
    <div className='login-popup'>
      <form onSubmit={handleSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt='Close' />
        </div>
        <div className="login-popup-inputs">
          {currState === 'Sign up' && (
            <input
              type='text'
              placeholder='Your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type='email'
            placeholder='Your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{currState === 'Sign up' ? 'Create Account' : 'Login'}</button>
        <div className="login-popup-condition">
          <input type='checkbox' required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currState === 'Login' ? (
          <p>Create a new account <span onClick={() => setCurrState('Sign up')}>Click here</span></p>
        ) : (
          <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
        )}
      </form>
    </div>
  );
};

export default Login;
