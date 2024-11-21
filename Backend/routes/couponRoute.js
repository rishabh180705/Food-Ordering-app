import express from 'express';
import {Add,fetchCoupons,Apply} from '../controllers/couponController.js';
const couponRouter = express.Router();

couponRouter.post('/AddCoupon',Add);
couponRouter.get('/coupons',fetchCoupons);
couponRouter.post('/apply',Apply);





export default couponRouter;