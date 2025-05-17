import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Coupon.css';

const CouponCreationForm = ({ url }) => {
  const defaultForm = {
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
  };

  const [formData, setFormData] = useState(defaultForm);
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/admin/coupons`);
      setCoupons(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [url]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEdit = (coupon) => {
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      maxDiscount: coupon.maxDiscount,
      usageLimit: coupon.usageLimit,
      userLimit: coupon.userLimit,
      validFrom: coupon.validFrom.slice(0, 10),
      validTill: coupon.validTill.slice(0, 10),
      active: coupon.active,
    });
    setEditingCouponId(coupon._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/api/admin/coupon/${id}`);
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCouponId) {
        await axios.put(`${url}/api/admin/coupon/${editingCouponId}`, formData);
        toast.success('Coupon updated successfully');
      } else {
        const response = await axios.post(`${url}/api/admin/AddCoupon`, formData);
        toast.success(`Coupon created successfully: ${response.data.code}`);
      }

      setFormData(defaultForm);
      setEditingCouponId(null);
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create/update coupon');
    } finally {
      setLoading(false);
    }
  };

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCoupons = filteredCoupons.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);

  return (
    <div className="coupon-form-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="coupon-form-heading">
        {editingCouponId ? 'Edit Coupon' : 'Create a New Coupon'}
      </h2>

      <form onSubmit={handleSubmit}>
        <label>Coupon Code</label>
        <input type="text" name="code" value={formData.code} onChange={handleChange} required />

        <label>Discount Type</label>
        <select name="discountType" value={formData.discountType} onChange={handleChange}>
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
          {loading ? (editingCouponId ? 'Updating...' : 'Creating...') : editingCouponId ? 'Update Coupon' : 'Create Coupon'}
        </button>

        {editingCouponId && (
          <button
            type="button"
            className="coupon-form-button cancel-button"
            onClick={() => {
              setFormData(defaultForm);
              setEditingCouponId(null);
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h3 className="coupon-list-heading">All Coupons</h3>

      <input
        type="text"
        className="coupon-search"
        placeholder="Search by code..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      <div className="coupon-list">
        {currentCoupons.length > 0 ? (
          <>
            <table className="coupon-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Min Order</th>
                  <th>Max Discount</th>
                  <th>Usage Limit</th>
                  <th>User Limit</th>
                  <th>Valid From</th>
                  <th>Valid Till</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCoupons.map((coupon) => (
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
                    <td>
                      <button onClick={() => handleEdit(coupon)}>Edit</button>
                      <button onClick={() => handleDelete(coupon._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination-controls">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="empty-state-message">No coupons found.</p>
        )}
      </div>
    </div>
  );
};

export default CouponCreationForm;
