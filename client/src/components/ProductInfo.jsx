import { useContext, useState } from "react";
import { assets } from "../assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from 'react-toastify'; // ✅ import toast

const ProductInfo = ({ productData }) => {
    const [size, setSize] = useState("");
    const { addToCart, currency } = useContext(ShopContext);

    const handleAddToCart = () => {
        if (!size) {
            toast.error("⚠️ Please select a size!");
            return;
        }

        addToCart(productData._id, size);
        toast.success("Product added to cart!");
    };

    return (
        <div className="flex-1">
            <h1 className="font-medium text-2xl mt-2">{productData?.name}</h1>

            <div className="flex items-center gap-1 mt-2">
                {[...Array(4)].map((_, index) => (
                    <img key={index} src={assets.star_icon} alt="Star" className="w-3.5" />
                ))}
                <img src={assets.star_dull_icon} alt="Star" className="w-3.5" />
                <p className="pl-2">{122}</p>
            </div>

            <p className="mt-5 text-3xl font-medium">{currency} {productData?.price}</p>
            <p className="mt-5 text-gray-500 md:w-4/5">{productData?.description}</p>

            <div className="flex flex-col gap-4 my-8">
                <p>Select Size</p>
                <div className="flex gap-2">
                    {productData?.sizes.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setSize(item)}
                            className={`border py-2 px-4 bg-gray-100 ${item === size ? "border-orange-300" : ""}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleAddToCart}
                className="bg-black text-white active:bg-gray-700 text-sm py-3 px-8"
            >
                ADD TO CART
            </button>

            <hr className="mt-8 w-4/5 border-gray-500" />

            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
                <p>100% Original Product</p>
                <p>Cash on delivery available on this product</p>
                <p>Easy return and Exchange Policy within 7 days</p>
            </div>
        </div>
    );
};

export default ProductInfo;
