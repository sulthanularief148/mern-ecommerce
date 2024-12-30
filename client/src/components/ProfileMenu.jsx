import { Link } from "react-router-dom";
import { assets } from "../assets";
import { profileMenuText } from "../constant";
import { ShopContext } from "../context/ShopContext";
import { useContext } from "react";
const ProfileMenu = () => {
    const { token, setToken, navigate, cartItems } = useContext(ShopContext)

    return (
        <div className="group relative">

            <img onClick={() => token ? null : navigate("/login")} src={assets.profile_icon} className="w-[1.25rem] cursor-pointer" alt="Profile Icon" />


            {token && <div className="hidden z-[1000] group-hover:block absolute dropdown-menu right-0 pt-4">
                <div className="flex  flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                    {profileMenuText.map(profile => {
                        return (
                            (

                                <Link key={profile.id} to={profile.path} >
                                    <p className="cursor-pointer hover:text-black">{profile.title}</p>
                                </Link>

                            )
                        )
                    })}
                    <Link
                        onClick={() => {
                            navigate('/login');
                            localStorage.removeItem("token")
                            setToken('')
                            cartItems({})
                        }}
                        to="#"
                    >

                        <p className="cursor-pointer hover:text-black">Logout</p>
                    </Link>

                </div>
            </div>}
        </div>
    );
}

export default ProfileMenu;