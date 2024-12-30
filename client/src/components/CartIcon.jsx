import { Link } from "react-router-dom";
import { assets } from "../assets";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
const CartIcon = () => {
    const { getCartCount } = useContext(ShopContext)
    return (
        <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart Icon" />
            <p className="absolute right-[-5px] bottom-[-5px] text-white bg-black text-center leading-4 rounded-full aspect-square w-4 text-[10px]">{getCartCount()}</p>
        </Link>
    )

}
export default CartIcon;