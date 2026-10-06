import { Link } from "react-router-dom";
import { assets } from "../assets";
import { profileMenuText } from "../constant";
import { ShopContext } from "../context/ShopContext";
import { useContext } from "react";

const ProfileMenu = () => {
    const { token, navigate, logout } = useContext(ShopContext)

    return (
        <div className="group relative">
            <img onClick={() => token ? null : navigate("/login")} src={assets.profile_icon} className="w-[1.25rem] cursor-pointer opacity-70 hover:opacity-100 transition-opacity" alt="Profile Icon" />

            {token && <div className="hidden z-[1000] group-hover:block absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-white shadow-card border border-gray-100 text-gray-600 rounded-2xl">
                    {profileMenuText.map(profile => (
                        <Link key={profile.id} to={profile.path}>
                            <p className="cursor-pointer hover:text-accent-600 transition-colors duration-250">{profile.title}</p>
                        </Link>
                    ))}
                    <p
                        onClick={logout}
                        className="cursor-pointer hover:text-accent-600 transition-colors duration-250"
                    >
                        Logout
                    </p>
                </div>
            </div>}
        </div>
    );
}

export default ProfileMenu;
