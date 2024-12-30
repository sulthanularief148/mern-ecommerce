import express from "express";
import { addToCart, updateUserCart, getUserCart } from '../controllers/cartController.js';
import authUser from "../middlewares/auth.js";


const cartRouter = express.Router()
cartRouter.post("/add", authUser, addToCart)
cartRouter.post("/update", authUser, updateUserCart)
cartRouter.get("/get", authUser, getUserCart)

export default cartRouter;