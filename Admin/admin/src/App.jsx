import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/sideBar/Sidebar'
import { Routes,Route } from 'react-router-dom'
import List from './pages/List/List'
import Add from './pages/Add/Add'
import Order from './pages/currentOrder/Order'
import AllOrders from './pages/AllOrders/AllOrders'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Coupon from './pages/Coupons/Coupon'
function App() {
      const url="http://localhost:5000";
  return (
    <>
    <ToastContainer/>
     <Navbar/>
     <hr/>
     <div className="app-content">
      <Sidebar/>
      <Routes>
        <Route path="/add" element={<Add url={url}/>} />
        <Route path="/list" element={<List url={url}/>} />
        <Route path="/order" element={<Order url={url}/>} />
        <Route path="/allOrders" element={<AllOrders url={url}/>} />
        <Route path="/addCoupon" element={<Coupon url={url}/>} />
      </Routes>
     </div>
    </>
  )
}

export default App
