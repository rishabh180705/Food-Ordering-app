import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Coupon.css';

const CouponCreationForm = () => {
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '',
    maxDiscount: '',
    usageLimit: '',
    userLimit: '',
    validFrom: '',
    validTill: '',
    active: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [coupons, setCoupons] = useState([]); // Initialize as an array

  // Fetch all coupons on component mount
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('/api/admin/coupons', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`, // Admin token for authentication
          },
        });
        setCoupons(response.data || []); // Set data if available, else set an empty array
      } catch (error) {
        setMessage('Failed to fetch coupons');
      }
    };

    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/admin/coupons', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`, // Admin token for authentication
        },
      });
      setMessage(`Coupon created successfully: ${response.data.code}`);
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderValue: '',
        maxDiscount: '',
        usageLimit: '',
        userLimit: '',
        validFrom: '',
        validTill: '',
        active: true,
      });
      // Refresh the list of coupons after a new one is added
      setCoupons([...coupons, response.data]);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coupon-form-container">
      <h2 className="coupon-form-heading">Create a New Coupon</h2>
      {message && (
        <p
          className={`coupon-form-message ${
            message.includes('successfully') ? 'success' : 'error'
          }`}
        >
          {message}
        </p>
      )}
    
      <form onSubmit={handleSubmit}>
        <label>Coupon Code</label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
        />

        <label>Discount Type</label>
        <select
          name="discountType"
          value={formData.discountType}
          onChange={handleChange}
        >
          <option value="percentage">Percentage</option>
          <option value="flat">Flat</option>
        </select>

        <label>Discount Value</label>
        <input
          type="number"
          name="discountValue"
          value={formData.discountValue}
          onChange={handleChange}
          required
        />

        <label>Min Order Value</label>
        <input
          type="number"
          name="minOrderValue"
          value={formData.minOrderValue}
          onChange={handleChange}
        />

        <label>Max Discount</label>
        <input
          type="number"
          name="maxDiscount"
          value={formData.maxDiscount}
          onChange={handleChange}
        />

        <label>Usage Limit</label>
        <input
          type="number"
          name="usageLimit"
          value={formData.usageLimit}
          onChange={handleChange}
        />

        <label>User Limit</label>
        <input
          type="number"
          name="userLimit"
          value={formData.userLimit}
          onChange={handleChange}
        />

        <label>Valid From</label>
        <input
          type="date"
          name="validFrom"
          value={formData.validFrom}
          onChange={handleChange}
          required
        />

        <label>Valid Till</label>
        <input
          type="date"
          name="validTill"
          value={formData.validTill}
          onChange={handleChange}
          required
        />

        <label>
          Active
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="coupon-form-button" disabled={loading}>
          {loading ? 'Creating...' : 'Create Coupon'}
        </button>
     
      </form>

      <h3 className="coupon-list-heading">All Coupons</h3>
      <div className="coupon-list">
        { Array.isArray(coupons) && coupons.length > 0 ? (
          <table className="coupon-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount Type</th>
                <th>Discount Value</th>
                <th>Min Order Value</th>
                <th>Max Discount</th>
                <th>Usage Limit</th>
                <th>User Limit</th>
                <th>Valid From</th>
                <th>Valid Till</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(coupons) && coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>{coupon.code}</td>
                  <td>{coupon.discountType}</td>
                  <td>{coupon.discountValue}</td>
                  <td>{coupon.minOrderValue}</td>
                  <td>{coupon.maxDiscount}</td>
                  <td>{coupon.usageLimit}</td>
                  <td>{coupon.userLimit}</td>
                  <td>{new Date(coupon.validFrom).toLocaleDateString()}</td>
                  <td>{new Date(coupon.validTill).toLocaleDateString()}</td>
                  <td>{coupon.active ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No coupons available</p>
        )}
      </div>
    </div>
  );
};

export default CouponCreationForm;
