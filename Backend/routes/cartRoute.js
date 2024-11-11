import express from 'express';
import { AddToCart, RemoveFromCart, getCart } from '../controllers/cartController.js';
import AuthMiddleware from "../middleware/auth.js";

const CartRouter = express.Router();

// Routes with AuthMiddleware to ensure user is authenticated
CartRouter.post('/add', AuthMiddleware, AddToCart);
CartRouter.post('/remove', AuthMiddleware, RemoveFromCart);
CartRouter.get('/get', AuthMiddleware, getCart);

export default CartRouter;
