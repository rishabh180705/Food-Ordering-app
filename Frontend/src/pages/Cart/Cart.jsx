import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/storeContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const { 
    cartItems, 
    food_list, 
    removeFromCart, 
    getTotalCartAmount, 
    instruction, 
    setInstruction, 
    url,total,setTotal
  } = useContext(StoreContext);

  const [promoCode, setPromoCode] = useState("");
  const [apply,setApply]=useState(false);
  const navigate = useNavigate();
  const isCartEmpty = Object.values(cartItems).every((qty) => qty === 0);
  const DELIVERY_FEE = 2;
  const deliveryFee = getTotalCartAmount() === 0 ? 0 : DELIVERY_FEE;

  const handleInstructionChange = (e) => {
    setInstruction(e.target.value);
  };

  const handlePromoCodeChange = (e) => {
    setPromoCode(e.target.value);
  };


  const ApplyPromoCode = async () => {
    if (promoCode.trim() === "") {
      alert("Please enter a valid promo code.");
      return;
    }
  
    try {
      // Make an API call to validate the promo code
      const response = await axios.post(`${url}/api/admin/apply`, { promoCode });
      
      // Check the response
      if (response.data.success) {
        // console.log("Promo code applied successfully:", response.data.code);
        alert(`Promo code "${promoCode}" applied successfully!`);
        // Optionally, update the UI or state to reflect the discount
        // Example: setTotalAmount(response.data.discountedAmount);
        if(!apply){
          setApply(true);
         
          let discountAmount = Number(response.data.code.discountValue)
          setTotal(discountAmount);
          
        }

      } else {
        alert(response.data.message || "Invalid promo code.");
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      alert("An error occurred while applying the promo code. Please try again.");
    }
  };
  

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0 && item.Availability) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross" aria-label="Remove item">
                    X
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
        {isCartEmpty && <p>Your cart is empty.</p>}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()-total}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${ getTotalCartAmount() + deliveryFee-total}</b>
            </div>
          </div>
          <button onClick={() => navigate("/order")} disabled={isCartEmpty}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode">
          <p>If you have a promo code, enter it here:</p>
          <div className="cart-promocode-input">
            <input
              value={promoCode}
              onChange={handlePromoCodeChange}
              type="text"
              placeholder="Promo code"
              name="promoCode"
              aria-label="Promo code"
            />
            <button onClick={ApplyPromoCode}>Submit</button>
          </div>
        </div>
        <div className="cart-instructions">
          <p>Add Special Instructions:</p>
          <textarea
            value={instruction}
            onChange={handleInstructionChange}
            placeholder="Enter any special instructions here..."
            rows="3"
            className="cart-instructions-textarea"
            aria-label="Special instructions"
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;

