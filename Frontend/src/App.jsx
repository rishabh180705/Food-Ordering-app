import { useState, React} from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import FoodFooter from "./components/Footer/FoodFooter";
import Login from "./components/loginPopup/Login";
import UserOrder from "./pages/userOrders/userOrder";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
 
  const [showLogin,setShowLogin]=useState(false);
  return (
    <>
    <ToastContainer/>
    {showLogin?<Login setShowLogin={setShowLogin} />:<></>}
    <div className="app">
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<PlaceOrder />} />
        <Route path="/myOrder" element={<UserOrder />} />
      </Routes>
    </div>
    <FoodFooter/>
    </>
  );
}

export default App;
