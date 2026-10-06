import { Link } from "react-router-dom";
import { assets } from "../assets";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
const CartIcon = () => {
    const { getCartCount } = useContext(ShopContext)
    return (
        <Link to="/cart" className="relative opacity-70 hover:opacity-100 transition-opacity">
            <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart Icon" />
            {getCartCount() > 0 && (
                <p className="absolute right-[-6px] bottom-[-6px] text-white bg-accent-500 text-center leading-4 rounded-full aspect-square w-4 text-[10px]">{getCartCount()}</p>
            )}
        </Link>
    )

}
export default CartIcon;