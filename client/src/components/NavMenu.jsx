import { NavLink } from "react-router-dom";
const NavMenu = ({ menuItems }) => (
    <ul className="hidden sm:flex text-sm text-gray-600 gap-7 tracking-wide">
        {menuItems.map(menu => (
            <NavLink key={menu.id} to={menu.path} className="flex flex-col items-center gap-1 hover:text-ink transition-colors duration-250">
                <p>{menu.link}</p>
                <hr className="hidden h-[1.5px] w-2/4 border-none bg-accent-500 transition-all duration-250 ease-linear" />
            </NavLink>
        ))}
    </ul>
);
export default NavMenu