import express from 'express';
import Authmiddleware from '../middleware/auth.js';
import { placeOrder,userOrders,listOrders,updateStatus, verifyOrder } from '../controllers/orderController.js';

const orderRouter=express.Router();

orderRouter.post('/place',Authmiddleware,placeOrder);


orderRouter.get('/userOrders',Authmiddleware,userOrders)

orderRouter.get('/Allorders',listOrders);
orderRouter.post('/status',updateStatus);
orderRouter.post('/verify',verifyOrder);




export default orderRouter;