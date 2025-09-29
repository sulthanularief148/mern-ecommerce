import { createContext, useEffect, useState } from "react";
// import { products } from "../assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { handleAxiosError } from "../../utils/handleAxiosError";

export const ShopContext = createContext()
const ShopContextProvider = (props) => {
    const currency = "₹"
    const delivery_fee = 10
    const [search, setSearch] = useState("")
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [products, setProducts] = useState([])
    const [token, setToken] = useState('')
    const navigate = useNavigate()
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const addToCart = async (itemId, size) => {
        if (!size) {
            console.error("Error");
            toast.error("Please select the size")
            return
        }
        let cartData = structuredClone(cartItems)

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            }
            else {
                cartData[itemId][size] = 1
            }
        }
        else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
        setCartItems(cartData)
        if (token) {
            try {

                const response = await axios.post(`${backendurl}/api/cart/add`, { itemId, size }, { headers: { Authorization: `Bearer ${token}` } });
                console.log(response.data);
            } catch (error) {
                console.log(error);
                toast.error(handleAxiosError(error, "Failed to add item to cart"));

            }
        }

    }
    const getCartCount = () => {
        let totalCount = 0;
        for (let items in cartItems) {
            for (let size in cartItems[items]) {
                try {
                    if (cartItems[items][size] > 0) {
                        totalCount += cartItems[items][size]
                    }
                } catch (error) {

                }
            }
        }
        return totalCount
    }
    const getCartAmount = () => {
        let totalAmount = 0;
        for (let itemId in cartItems) {
            const itemInfo = products.find((product) => product._id === itemId);
            if (!itemInfo) continue;

            for (let size in cartItems[itemId]) {
                try {
                    const quantity = cartItems[itemId][size];
                    if (quantity > 0) {
                        totalAmount += itemInfo.price * quantity;
                    }
                } catch (error) {
                    console.error("Error calculating cart amount:", error);
                }
            }
        }
        return totalAmount;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems)
        cartData[itemId][size] = quantity;
        setCartItems(cartData)
        if (token) {
            try {
                const response = await axios.post(backendurl + '/api/cart/update', { itemId, size, quantity }, { headers: { Authorization: `Bearer ${token}` } })
                console.log(response);

            } catch (error) {
                console.log(error);
                toast.error(error.message)

            }
        }
    }
    const getProducts = async () => {
        try {
            const response = await axios.get(backendurl + "/api/product/list");
            console.log(response.data);

            if (response.data.success) {
                setProducts(response.data.products)
            } else {
                toast.error(handleAxiosError(error, "Failed to fetch products"));
            }
        } catch (error) {
            toast.error(error.message)
            toast.error(handleAxiosError(error, "No Product Found"));
        }
    }
    const getUserCart = async (token) => {
        try {
            const response = await axios.get(backendurl + "/api/cart/get", { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }

        } catch (error) {
            console.error("Error fetching user cart:", error);
            toast.error(handleAxiosError(error, "No cart items found. Add some products to your cart!"));

        }
    }
    useEffect(() => { getProducts() }, [])
    useEffect(() => {
        if (!token && localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"))
            getUserCart(localStorage.getItem("token"))
        }
    }, [])
    const value = { currency, products, delivery_fee, search, setSearch, showSearch, setShowSearch, navigate, cartItems, addToCart, getCartCount, updateQuantity, getCartAmount, backendurl, token, setToken, setCartItems }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;