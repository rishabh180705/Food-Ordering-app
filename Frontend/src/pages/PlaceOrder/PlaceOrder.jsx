import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/storeContext';

const PlaceOrder = () => {
    const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        phone: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const handleProceedToPayment = async (event) => {
      event.preventDefault();
        // Add form validation
        if (!data.firstName || !data.lastName || !data.email || !data.street || !data.city || !data.state || !data.pincode || !data.phoneNumber) {
            alert("Please fill in all required fields.");
            return;
        }

        // Payment logic here (e.g., initiate Stripe session)
        // You may need to send data to backend for payment processing
    };

    const handleCashOnDelivery = () => {
        // Handle cash on delivery logic here
    };

    return (
        <div>
            <form onSubmit={handleProceedToPayment} className='place-order'>
                <div className="place-order-left">
                    <p className='title'>Delivery Information</p>
                    <div className="multi-fields">
                        <input type="text" name="firstName" placeholder='First Name' value={data.firstName} onChange={handleInputChange} />
                        <input type="text" name="lastName" placeholder='Last Name' value={data.lastName} onChange={handleInputChange} />
                    </div>
                    <input type="email" name="email" placeholder='Email address' value={data.email} onChange={handleInputChange} />
                    <input type="text" name="street" placeholder='Street' value={data.street} onChange={handleInputChange} />
                    <div className="multi-fields">
                        <input type="text" name="city" placeholder='City' value={data.city} onChange={handleInputChange} />
                        <input type="text" name="state" placeholder='State' value={data.state} onChange={handleInputChange} />
                    </div>
                    <div className="multi-fields">
                        <input type="text" name="pincode" placeholder='Pin code' value={data.pincode} onChange={handleInputChange} />
                        <input type="text" name="landmark" placeholder='Landmark' value={data.landmark} onChange={handleInputChange} />
                    </div>
                    <input type="text" name="phone" placeholder='Phone Number' value={data.phoneNumber} onChange={handleInputChange} />
                </div>
                
                <div className="place-order-right">
                    <div className="cart-total">
                        <h2>Cart Totals</h2>
                        <div>
                            <div className="cart-total-details">
                                <p>SubTotal</p>
                                <p>${getTotalCartAmount()}</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>Delivery Fee</p>
                                <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <b>Total</b>
                                <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
                            </div>
                        </div>
                        <button type="submit" onClick={handleProceedToPayment}>PROCEED TO PAYMENT</button>
                        <button type="button" onClick={handleCashOnDelivery}>CASH ON DELIVERY</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PlaceOrder;
