import { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { SectionWrapper } from "../hoc";
import { Title, ProductsItem } from "../components";

const Wishlist = () => {
  const { wishlist, loadWishlist, user, authReady } = useContext(ShopContext);

  useEffect(() => {
    if (user) loadWishlist();
  }, [user]);

  if (!authReady) return null;

  return (
    <div className="border-t pt-14">
      <Title text1="MY" text2="WISHLIST" />
      {wishlist.length === 0 ? (
        <p className="py-12 text-center text-gray-400">
          Your wishlist is empty. Tap the heart icon on any product to save it here.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-8 mt-8">
          {wishlist.map((item) => (
            <ProductsItem key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionWrapper(Wishlist, "wishlist");
