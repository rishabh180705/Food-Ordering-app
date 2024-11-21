import express from 'express';
import Authmiddleware from '../middleware/auth.js';
import { placeOrder,userOrders,listOrders,updateStatus } from '../controllers/orderController.js';

const orderRouter=express.Router();

orderRouter.post('/place',Authmiddleware,placeOrder);


orderRouter.get('/userOrder',Authmiddleware,userOrders)

orderRouter.get('/Allorders',listOrders);
orderRouter.post('/status',updateStatus);




export default orderRouter;