import React, { useContext, useState, useEffect } from "react";
import "./userOrder.css";
import { StoreContext } from "../../context/storeContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";

const UserOrder = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { url, token } = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/userOrders", {
        headers: { token },
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const handleTrackOrder = (orderId) => {
    console.log(`Track order: ${orderId}`);
    // Add tracking functionality
  };

  return (
    <section className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p>{error}</p>
        ) : data.length === 0 ? (
          <p>You have no orders yet.</p>
        ) : (
          <ul>
            {data.map((order, index) => (
              <li key={index} className="my-orders-order">
                <img
                  src={assets.parcel_icon || "path/to/default_image.png"}
                  alt="Parcel Icon"
                />
                <p>
                  {order.items
                    .map((item) => `${item.name} X ${item.quantity}`)
                    .join(", ")}
                </p>
                <p>${order.amount}.00</p>
                <p>Items: {order.items.length}</p>
                <p>
                  <span>&#x25cf;</span> <b>{order.status}</b>
                </p>
                <button onClick={() => handleTrackOrder(order.id)}>
                  Track Order
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default UserOrder;


