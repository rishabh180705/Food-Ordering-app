import React, { useContext, useState, useEffect } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/storeContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PlaceOrder = () => {
    const { getTotalCartAmount, token, food_list,cartItems, instruction, url, total } = useContext(StoreContext);
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
        phone: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!token || getTotalCartAmount() === 0) {
            navigate("/cart");
        }
    }, [token, getTotalCartAmount, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const handleProceedToPayment = async (event) => {
        event.preventDefault();
        // Add validation logic here
        let orderItems=[];
        food_list.map((item)=>{
            if(cartItems[item._id]>0 && item.Availability){
                let itemInfo=item;
                itemInfo['quantity'] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        })
        let orderData={address:data,items:orderItems
            ,amount:grandTotal,
            instruction,
        }
        let response=await axios.post(url+"/api/order/place",orderData,{headers:{token}});
        if(response.data.success){
            const {session_url}=response.data;
            window.location.replace(session_url);
        }
        else{
            alert("Error");
        }
    };

    const handleCashOnDelivery = async () => {
        // Handle cash on delivery logic
    };

    const DELIVERY_FEE = getTotalCartAmount() === 0 ? 0 : 2;
    const grandTotal = getTotalCartAmount() + DELIVERY_FEE - total;
  
    

    return (
        <div>
            <form onSubmit={handleProceedToPayment} className="place-order">
                <div className="place-order-left">
                    <p className="title">Delivery Information</p>
                    <div className="multi-fields">
                        <input required type="text" name="firstName" placeholder="First Name" value={data.firstName} onChange={handleInputChange} />
                        <input required type="text" name="lastName" placeholder="Last Name" value={data.lastName} onChange={handleInputChange} />
                    </div>
                    <input required type="email" name="email" placeholder="Email address" value={data.email} onChange={handleInputChange} />
                    <input required type="text" name="street" placeholder="Street" value={data.street} onChange={handleInputChange} />
                    <div className="multi-fields">
                        <input required type="text" name="city" placeholder="City" value={data.city} onChange={handleInputChange} />
                        <input required type="text" name="state" placeholder="State" value={data.state} onChange={handleInputChange} />
                    </div>
                    <div className="multi-fields">
                        <input required type="text" name="pincode" placeholder="Pin code" value={data.pincode} onChange={handleInputChange} />
                        <input required type="text" name="landmark" placeholder="Landmark" value={data.landmark} onChange={handleInputChange} />
                    </div>
                    <input required type="text" name="phone" placeholder="Phone Number" value={data.phone} onChange={handleInputChange} />
                </div>

                <div className="place-order-right">
                    <div className="cart-total">
                        <h2>Cart Totals</h2>
                        <div>
                            <div className="cart-total-details">
                                <p>Subtotal</p>
                                <p>${getTotalCartAmount().toFixed(2)-total}</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>Delivery Fee</p>
                                <p>${DELIVERY_FEE.toFixed(2)}</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <b>Total</b>
                                <b>${grandTotal.toFixed(2)}</b>
                            </div>
                        </div>
                        <button type="submit">PROCEED TO PAYMENT</button>
                        {/* <button type="button" onClick={handleCashOnDelivery}>
                            CASH ON DELIVERY
                        </button> */}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PlaceOrder;
