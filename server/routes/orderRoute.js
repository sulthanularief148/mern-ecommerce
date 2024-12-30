import express from 'express'
import { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, verifyStripe, updateStatus, verifyRazorpay } from '../controllers/orderController.js'
import adminAuth from '../middlewares/adminAuth.js'
import authUser from '../middlewares/auth.js'


const orderRouter = express.Router()

// Admin Features
orderRouter.post("/list", adminAuth, allOrders)
orderRouter.post("/status", adminAuth, updateStatus)


// Payment Features
orderRouter.post("/place", authUser, placeOrder)
orderRouter.post("/stripe", authUser, placeOrderStripe)
orderRouter.post("/razorpay", authUser, placeOrderRazorpay)

// User Feature
orderRouter.post("/userorders", authUser, userOrders)
orderRouter.post("/verifyStripe", authUser, verifyStripe)
orderRouter.post("/verifyRazorPay", authUser, verifyRazorpay)
export default orderRouter;
