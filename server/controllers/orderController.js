import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import Razorpay from 'razorpay'
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken'

const currency = 'inr'
const deliveryCharges = 10

const stripe = new Stripe(process.env.STRIPE_API_KEY)
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET
})
const placeOrderValidation = [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('items').isArray().withMessage('Items should be an array'),
    body('amount').isNumeric().withMessage('Amount should be a number'),
    body('address').notEmpty().withMessage('Address is required')
];
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const orderData = { userId, items, amount, paymentMethod: "COD", payment: false, date: Date.now(), address };
        const newOrder = new orderModel(orderData);
        await newOrder.save()
        await userModel.findByIdAndUpdate(userId, { cartData: {} })
        res.json({ success: true, message: "Order placed successfully" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error while placing order" })


    }
}

const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const orderData = {
            userId, items, amount, address, paymentMethod: "Stripe", payment: false, date: Date.now()
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save()
        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,

                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity,

        }))
        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charges",

                },
                unit_amount: deliveryCharges * 100
            },
            quantity: 1,
        })
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment'
        })
        res.json({ session: session.id, success: true, session_url: session.url })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error Stripe Payment Gateway order" + error.message })
    }
}
// Verify Stripe
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;
    try {
        if (typeof success !== 'boolean' || !orderId || !userId) {
            return res.status(400).json({ success: false, message: "Invalid input data" });
        }
        if (success === true) {
            await orderModel.findByIdAndUpdate(orderId, {
                payment: true
            })
            await userModel.findByIdAndUpdate(userId, {
                cartData: {}
            })
            res.json({ success: true, message: "Order Placed Successfully" })
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Order Cancelled" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error Verify Stripe Payment Gateway order" + error.message })

    }

}
// const verifyStripe = async (req, res) => {
//     const { orderId, success } = req.body;

//     try {
//         // Validate JWT
//         const token = req.headers.authorization?.split(' ')[1];
//         if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEYT);
//         const userId = decoded.id;

//         // Input validation
//         if (!orderId || typeof success !== 'boolean') {
//             return res.status(400).json({ success: false, message: "Invalid data" });
//         }

//         // Handle payment success
//         if (success) {
//             await orderModel.findByIdAndUpdate(orderId, { payment: true });
//             await userModel.findByIdAndUpdate(userId, { cartData: {} });
//             return res.json({ success: true, message: "Order placed successfully" });
//         } 

//         // Handle payment failure
//         await orderModel.findByIdAndUpdate(orderId, { status: "cancelled" });
//         return res.json({ success: false, message: "Order cancelled" });

//     } catch (error) {
//         console.error("Stripe verification error:", error);
//         res.status(500).json({ success: false, message: "Error verifying Stripe payment" });
//     }
// };
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const orderData = {
            userId, items, amount, address, paymentMethod: "Stripe", payment: false, date: Date.now()
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save()
        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()

        }
        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error)
                return res.json({ success: false, message: "Error creating order" })
            }
            res.json({ success: true, order })
        })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error Verify Razorpay Payment Gateway order" + error.message })
    }
}
// Verify Razorpay
const verifyRazorpay = async (req, res) => {
    try {
        // const { userId, razorpay_order_id } = req.body;
        // Validate the input
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid input data" });
        }

        // Verify the Razorpay signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expected_signature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
            .update(body)
            .digest('hex');

        if (expected_signature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === "paid") {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            return res.json({ success: true, message: "Payment successfully" })
        } else {
            res.json({ success: false, message: "Payment Failed" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// All orders data for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find()
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// User Order Data For Front End
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Update order Status from admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
        res.json({ success: true, message: "Order status updated successfully", order })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error while updating order status" + error.message })
    }
}

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe, verifyRazorpay };