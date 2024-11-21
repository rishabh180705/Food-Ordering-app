import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const url = "http://localhost:5000";
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");
  const [instruction, setInstruction] = useState("");
 
  const navigate = useNavigate();

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
      if (item && item.Availability) {
        return total + item.price * quantity;
      }
      return total;
    }, 0);
  };

  const [total,setTotal]=useState(0);

  const loadCartData = async (tokenFromStorage) => {
    try {
      const response = await axios.get(`${url}/api/cart/get`, {
        headers: { token: tokenFromStorage },
      });
      setCartItems(response.data.cartData);
    } catch (error) {
      console.error("Failed to load cart data:", error);
    }
  };

  const loggingOut = () => {
    try {
      setToken("");
      localStorage.removeItem("token");
      setCartItems({});
      navigate("/"); // Redirect to home page
      console.log("Successfully logged out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage) {
      setToken(tokenFromStorage); // Set token state
      loadCartData(tokenFromStorage); // Use token to load cart data
    }
    fetchFoodList(); // Fetch the food list
  }, []); // Only runs on initial load (similar to componentDidMount)

  useEffect(() => {
    // Reset cart items when the token is cleared
    if (!token) {
      setCartItems({});
    }
  }, [token]); // Runs when `token` is updated (like on logout)

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
    loadCartData,
    loggingOut,
    instruction,
    setInstruction,
    total,
    setTotal,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
