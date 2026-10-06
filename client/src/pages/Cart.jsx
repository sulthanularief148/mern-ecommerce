import { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { SectionWrapper } from "../hoc";
import { CartTotal, Title } from "../components";
import { assets } from "../assets";

const Cart = () => {
  const { cartItems, currency, updateQuantity } = useContext(ShopContext);

  return (
    <div className="border-t pt-14">
      <Title text1="YOUR" text2="CART" />
      <div>
        {cartItems.length === 0 ? (
          <p className="py-12 text-center text-gray-400">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_1fr_1fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  src={item.product?.images?.[0] || "/placeholder-product.svg"}
                  alt={item.product?.name || "Product"}
                  className="w-16 sm:w-20 rounded-xl"
                />
                <div className="">
                  <p className="text-xs sm:text-lg font-medium">{item.product?.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm">{currency}{item.product?.price * item.quantity}</p>
                    <p className="px-2 sm:px-3 sm:py-1 border border-gray-200 bg-gray-50 rounded-full">Size: {item.size}</p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item.id, Number(e.target.value))}
                type="number"
                defaultValue={item.quantity}
                min={1}
                className="border border-gray-200 rounded-xl max-w-10 sm:max-w-20 py-1.5 px-1 sm:px-2 bg-gray-50 focus:border-accent-500 focus:bg-white outline-none transition-colors duration-250"
              />
              <img
                onClick={() => updateQuantity(item.id, 0)}
                src={assets.bin_icon}
                className="cursor-pointer w-4 sm:w-5 opacity-60 hover:opacity-100 transition-opacity"
                alt="Remove item"
              />
            </div>
          ))
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 my-20">
        <Link
          to="/shop"
          className="order-2 sm:order-1 text-sm text-gray-500 hover:text-ink underline underline-offset-2"
        >
          ← Continue Shopping
        </Link>
        <div className="order-1 sm:order-2 w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <PlaceOrderButton />
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaceOrderButton = () => {
  const { navigate, cartItems } = useContext(ShopContext);
  return (
    <button
      disabled={cartItems.length === 0}
      onClick={() => navigate("/checkout")}
      className="text-white bg-ink text-sm my-8 px-8 py-3 rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ink"
    >
      PROCEED TO CHECKOUT
    </button>
  );
};

export default SectionWrapper(Cart, "cart");
