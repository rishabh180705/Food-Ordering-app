import React from 'react';
import './FoodFooter.css';
import { assets } from '../../assets/frontend_assets/assets';

const FoodFooter = () => {
  return (
    <footer className="food-footer" >
      <div className="footer-content" id='footer'>
        <img src={assets.logo}/>
        <div className="footer-links">
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/menu">Menu</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="contact-info">
          <p>Email: support@fooddeliveryapp.com</p>
          <p>Phone: (+91) 9627962812</p>
        </div>
        <div className="social-media">
          <h4>Follow us on:</h4>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Food Delivery App. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default FoodFooter;
