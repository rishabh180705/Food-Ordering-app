import React from 'react';
import './verify.css';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { StoreContext } from '../../context/storeContext';
import { useEffect } from 'react';
import axios from 'axios';
export const Verify = () => {
    const navigate=useNavigate();
    const[searchParams,setSearchParams] = useSearchParams();
    const success=searchParams.get('success');
    const orderId=searchParams.get('OrderId');
    const{url}=useContext(StoreContext);
    const verifyPayment=async ()=>{
        const response= await axios.post(url+"/api/order/verify",{success,orderId});
        if(response.data.success){
          navigate("/myOrder");
        }
        else{
            navigate("/");
        }
    }
   useEffect(()=>{
    verifyPayment();
   },[])

  return (
    <div className='verify'>
        <div className='spinner'>
     </div>
    </div>
  )
}
