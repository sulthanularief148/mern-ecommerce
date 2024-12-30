import { useState } from "react";

const ProductImages = ({ productData }) => {
  const [image, setImage] = useState(productData?.image[0]);

  return (
    <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
      <div className="flex sm:flex-col overflow-x-auto sm:w-[18.7%] w-full sm:overflow-y-scroll justify-between sm:justify-normal">
        {productData?.image.map((item, index) => (
          <img
            key={index}
            onClick={() => setImage(item)}
            src={item}
            alt=""
            className="w-24% sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
          />
        ))}
      </div>
      <div className="w-full sm:w-[80%]">
        <img src={image} className="w-full h-auto" alt="Product" />
      </div>
    </div>
  );
};

export default ProductImages;
