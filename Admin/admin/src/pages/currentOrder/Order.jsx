import React, { useState, useEffect } from 'react';
import './Order.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/admin_assets/assets';

const Order = ({ url }) => {
    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/order/Allorders`);
            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                toast.error("Failed to fetch orders.");
            }
        } catch (error) {
            toast.error("An error occurred while fetching orders.");
            console.error("Error fetching orders:", error);
        }
    };
    const statusHandler=async (event,orderId) => {
      const response=await axios.post(url+'/api/order/status',{
        orderId,
        status:event.target.value
      })
    if(response.data.success){
       await fetchAllOrders();
    }
    }

    useEffect(() => {
        fetchAllOrders();
    }, [statusHandler]);

    return (
        <div className="order add">
            <h3>Order Page</h3>
            <div className="order-list">
                {orders.map((order) => (
                    <div key={order.id} className="order-item">
                        <img src={assets.parcel_icon} alt="Order Icon" />
                        <div>
                            <p className="order-item-food">
                                {order.items.map((item, index) => {
                                    if (index === order.items.length - 1) {
                                        return `${item.name} X ${item.quantity}`;
                                    } else {
                                        return `${item.name} X ${item.quantity}, `;
                                    }
                                })}
                            </p>
                            <p className="order-item-name">
                                {order.address.firstName} {order.address.lastName}
                            </p>
                            {order.instruction && (
                                <p className="order-instruction">
                                    {order.instruction}
                                </p>
                            )}
                            <p className="order-item-address">
                                {[
                                    order.address.street,
                                    order.address.city,
                                    order.address.state,
                                    order.address.pincode,
                                ].filter(Boolean).join(', ')}
                            </p>
                            <p className="order-item-phone">{order.address.phone}</p>
                        </div>
                        <p>Items: {order.items.length}</p>
                        <p>${order.amount.toFixed(2)}</p>
                        <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
                          <option value="Food Processing">Food Processing</option>
                          <option value="Out For Delivery">Out For Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Order;
