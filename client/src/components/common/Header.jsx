
import { assets } from "../../assets";
import { navMenu } from "../../constant";
import { useContext, useState } from "react";
import NavMenu from "../NavMenu"
import ProfileMenu from "../ProfileMenu"
import MobileNav from "../MobileNav"
import CartIcon from "../CartIcon"
import WishlistIcon from "../WishlistIcon"
import Logo from "../Logo"
import { Link } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";

const Header = () => {
    const [visible, setVisible] = useState(false);

    const { setShowSearch } = useContext(ShopContext)
    return (
        <nav className="sticky top-0 z-40 flex items-center justify-between py-4 font-medium bg-white/90 backdrop-blur-sm border-b border-gray-100">
            <Link to={`/`} className="shrink-0">
                <Logo />
            </Link>

            <NavMenu menuItems={navMenu} />
            <div className="flex items-center gap-4">
                <img src={assets.search_icon} onClick={() => setShowSearch(true)} alt="Search Icon" className="w-[1.1rem] cursor-pointer opacity-70 hover:opacity-100 transition-opacity" />
                <ProfileMenu />
                <WishlistIcon />
                <CartIcon />
                <img
                    onClick={() => setVisible(true)}
                    src={assets.menu_icon}
                    className="w-5 cursor-pointer sm:hidden opacity-70 hover:opacity-100 transition-opacity"
                    alt="Menu Icon"
                />
            </div>
            <MobileNav menuItems={navMenu} visible={visible} setVisible={setVisible} />
        </nav>
    );
};

export default Header;
