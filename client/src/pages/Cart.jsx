import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { SectionWrapper } from "../hoc";
import { CartTotal, Title } from "../components";
import { assets } from "../assets";

const Cart = () => {
  const { products, cartItems, currency, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            tempData.push({
              id: itemId,
              size,
              quantity: cartItems[itemId][size],
            });
          }
        }
      }
      setCartData(tempData);
    }

  }, [cartItems, products]);

  return (
    <div className="border-t pt-14">
      <Title text1="YOUR" text2="CART" />
      <div>
        {cartData.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartData.map((item) => {
            const productData = products.find((product) => product?._id === item?.id);
            if (!productData) {
              return <p key={item.id + item?.size}>Product not found for ID: {item.id}</p>;
            }
            return (
              <div
                key={`${item.id}-${item.size}`}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_1fr_1fr] items-center gap-4"
              >
                <div className="flex items-start gap-6">
                  <img
                    src={productData?.images[0] || "/placeholder-image.jpg"}
                    alt={productData?.name || "Product"}
                    className="w-16 sm:w-20"
                  />
                  <div className="">
                    <p className="text-xs sm:text-lg font-medium">{productData?.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">{currency}{productData.price * item.quantity}</p>
                      <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">Size: {item?.size}</p>
                    </div>
                  </div>

                </div>
                <input onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item.id, item.size, Number(e.target.value))} type="number" defaultValue={item.quantity} min={1} className="border max-w-10 sm:max-w-20 py-1 px-1 sm:px-2" />
                <img onClick={() => updateQuantity(item.id, item.size, 0)} src={assets.bin_icon} className="cursor-pointer w-4 sm:w-5" alt="" />
              </div>
            );
          })
        )}
      </div>
      <div className="justify-end flex my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button onClick={() => navigate("/place-order")} className="text-white bg-black text-sm my-8 px-8 py-3">PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Cart, "cart");
