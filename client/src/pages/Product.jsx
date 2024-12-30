// Product.js
import { useParams } from "react-router-dom";
import { SectionWrapper } from "../hoc";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets";
import { DescriptionReview, ProductInfo, RelatedProduct } from "../components";
import { productContent } from "../constant";

const Product = () => {
  const { productsId } = useParams();
  const { products } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");

  const fetchProducts = async () => {
    products.map((item) => {
      if (item._id === productsId) {
        setProductData(item);
        setImage(item?.images[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [productsId]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:w-[18.7%] w-full sm:overflow-y-scroll justify-between sm:justify-normal">
            {productData.images.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-24% sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} className="w-full h-auto" alt="" />
          </div>
        </div>
        <ProductInfo productData={productData} />
      </div>
      <DescriptionReview />
      {/* Related Products */}
      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default SectionWrapper(Product, "product");
