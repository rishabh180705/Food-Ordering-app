import React from 'react'
import './Order.css'

const Order = ({url}) => {
  const [orders,setOrders]=useState([]);
  const fetchAllOrders=async()=>{
      const response=await axios.get(url+'/api/order/Allorders');
      if()
  }
  return (
    <div>
      
    </div>
  )
}

export default Order
