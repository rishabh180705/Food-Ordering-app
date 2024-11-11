import express from 'express';
import Authmiddleware from '../middleware/auth.js';
import { placeOrder } from '../controllers/orderController.js';

const orderRouter=express.Router();

orderRouter.post('/place',Authmiddleware,placeOrder);






export default orderRouter;