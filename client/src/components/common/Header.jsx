
import { assets } from "../../assets";
import { navMenu } from "../../constant";
import { useContext, useState } from "react";
import { NavMenu, ProfileMenu, MobileNav, CartIcon } from "../../components"
import { Link } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";

const Header = () => {
    const [visible, setVisible] = useState(false);

    const { setShowSearch } = useContext(ShopContext)
    return (
        <nav className="flex items-center justify-between py-5 font-medium">
            <Link to={`/`}>
                <img src={assets.logo} className="w-16" alt="Logo" />
            </Link>

            <NavMenu menuItems={navMenu} />
            <div className="flex items-center gap-3">
                <img src={assets.search_icon} onClick={() => setShowSearch(true)} alt="Search Icon" className="w-[1.25rem] cursor-pointer" />
                <ProfileMenu />
                <CartIcon />
                <img
                    onClick={() => setVisible(true)}
                    src={assets.menu_icon}
                    className="w-5 cursor-pointer sm:hidden"
                    alt="Menu Icon"
                />
            </div>
            <MobileNav menuItems={navMenu} visible={visible} setVisible={setVisible} />
        </nav>
    );
};

export default Header;
