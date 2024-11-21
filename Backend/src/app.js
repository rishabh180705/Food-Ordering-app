
import express from 'express';
import cors from "cors";
import foodRouter from "../routes/foodRoute.js";
import userRoute from "../routes/userRoute.js";
import CartRouter from '../routes/cartRoute.js';
import orderRouter from '../routes/orderRoute.js';
import couponRouter from '../routes/couponRoute.js';
import cookieParser from 'cookie-parser';



const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Array of allowed origins
    credentials: true, // Allow cookies and credentials
  }));

  app.use(cookieParser());


// api endpoints
app.use('/api/food',foodRouter);
app.use('/api/user',userRoute);
app.use('/api/cart',CartRouter);
app.use('/api/order',orderRouter);
app.use('/api/admin',couponRouter);
export default app;



