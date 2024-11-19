import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const url = "http://localhost:5000";
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");


  // Fetch food list from server
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Failed to fetch food list:", error);
    }
  };

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Failed to add item to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] > 1) {
        updatedCart[itemId] -= 1;
      } else {
        delete updatedCart[itemId]; // Remove item if quantity reaches 0
      }
      return updatedCart;
    });

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Failed to remove item from cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const item = food_list.find((product) => product._id === itemId);
      return item ? total + item.price * quantity : total;
    }, 0);
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.get(`${url}/api/cart/get`, {
        headers: { token }
      });
     
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Failed to load cart data:", error);
    }
  };
  useEffect(() => {
    async function loadData() {
      const tokenFromStorage = localStorage.getItem("token");
      if (tokenFromStorage) {
        setToken(tokenFromStorage); // Set token state
        await loadCartData(tokenFromStorage); // Use the token from storage to load cart data
      }
      fetchFoodList(); // Fetch the food list
    }
    loadData();
  }, []);
  

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
