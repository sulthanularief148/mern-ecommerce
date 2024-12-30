import userModel from "../models/userModel.js"

const addToCart = async (req, res) => {
    try {
        const { itemId, userId, size } = req.body;
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Added To Cart" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }

}
const updateUserCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;
        const userData = await userModel.findById(userId)
        let cartData = userData.cartData;
        cartData[itemId][size] = quantity;
        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Updated Cart" })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId)
        
        let cartData = userData.cartData;
        if (!cartData && !Object.keys(cartData).length === 0) {
            res.json({ success: false, message: "Cart is empty" })
        }
        console.log(cartData);

        res.json({ success: true, cartData: cartData, success: true })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

export { addToCart, updateUserCart, getUserCart }