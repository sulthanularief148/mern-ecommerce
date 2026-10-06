import { Link } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const WishlistIcon = () => {
    const { wishlist } = useContext(ShopContext);
    return (
        <Link to="/wishlist" className="relative opacity-70 hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 24 24" className="w-[1.15rem] h-[1.15rem]" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 21s-6.7-4.35-9.3-8.1C1 10.1 1.7 6.6 4.6 5.2c2.2-1.05 4.6-.2 5.9 1.6l1.5 2 1.5-2c1.3-1.8 3.7-2.65 5.9-1.6 2.9 1.4 3.6 4.9 1.9 7.7C18.7 16.65 12 21 12 21z" />
            </svg>
            {wishlist.length > 0 && (
                <p className="absolute right-[-6px] bottom-[-6px] text-white bg-accent-500 text-center leading-4 rounded-full aspect-square w-4 text-[10px]">{wishlist.length}</p>
            )}
        </Link>
    );
};

export default WishlistIcon;
