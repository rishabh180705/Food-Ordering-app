import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/storeContext";
import {useNavigate} from 'react-router-dom'


const Navbar = ({setShowLogin}) => {
  const navigate=useNavigate();
  const [menu, setMenu] = useState("home");
    const{getTotalCartAmount,token,setToken}=useContext(StoreContext);
    
    const logout = () => {
      try {
        setToken("");
       localStorage.removeItem("token");
        navigate("/");
        console.log("Successfully logged out");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };
    

  return (
    <div className="navbar">
    <Link to='/'> <img src={assets.logo} alt="" className="logo" /></Link>  
      <ul className="navbar-menu">
        <Link to='/'
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}>
          home
        </Link>
        <a href='#explore-menu'
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}>
          menu
        </a>
        <a href='#app-download'
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}>
          mobile app
        </a>
        <a href='#footer'
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}>
          contact us
        </a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} />
        <div className="navbar-search-icon">
          <Link to="/cart"><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        {!token?<button onClick={()=>setShowLogin(true)}>sign in</button>
        :<div className="navbar-profile">
          <img src={assets.profile_icon} alt="" />
          <ul className='navbar-profile-dropdown'>
          <li><img src={assets.bag_icon} alt=""/><p>Orders</p> </li>
          <hr/>
          <li onClick={logout}><img src={assets.logout_icon} alt=""/><p>Logout</p>  </li>
          </ul>
          
          </div>}
        
      </div>
    </div>
  );
};

export default Navbar;
