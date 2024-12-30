import { NavLink } from "react-router-dom";
const NavMenu = ({ menuItems }) => (
    <ul className="hidden sm:flex text-sm text-gray-700 gap-5">
        {menuItems.map(menu => (
            <NavLink key={menu.id} to={menu.path} className="flex flex-col items-center gap-1">
                <p>{menu.link}</p>
                <hr className="hidden h-[1.5px] w-2/4 border-none bg-gray-700 transition-all duration-100 ease-linear" />
            </NavLink>
        ))}
    </ul>
);
export default NavMenu