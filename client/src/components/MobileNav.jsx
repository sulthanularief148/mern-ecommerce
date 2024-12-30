import { NavLink } from "react-router-dom";
import { assets } from "../assets";
const MobileNav = ({ menuItems, visible, setVisible }) => (
    visible && (
        <div className="absolute inset-0 z-50 bg-white leading-4 transition-all w-full">
            <div className="flex flex-col text-gray-600">
                <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
                    <img className="h-4 rotate-100" src={assets.dropdown_icon} alt="Dropdown Icon" />
                    <p>Back</p>
                </div>
                {menuItems.map(menu => (
                    <NavLink
                        key={menu.id}
                        to={menu.path}
                        onClick={() => setVisible(false)}
                        className="py-6 pl-5 border"
                    >
                        {menu.link}
                    </NavLink>
                ))}
            </div>
        </div>
    )
);
export default MobileNav;