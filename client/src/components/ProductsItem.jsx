import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductsItem = ({ id, name, price, image }) => {
    const { currency } = useContext(ShopContext);
    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
            <div className="w-full aspect-[4/5] bg-gray-100 relative overflow-hidden">
                {/* 👇 Skeleton Placeholder */}
                {!imgLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse z-0"></div>
                )}

                {/* 👇 Actual Image */}
                {image && (
                    <img
                        src={image[0]}
                        alt={name}
                        loading="lazy"
                        onLoad={() => setImgLoaded(true)}
                        className={`w-full h-full object-cover transition-transform duration-300 ease-in-out z-10 ${imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                            }`}
                    />
                )}
            </div>

            <p className="pt-3 pb-1 text-sm">{currency}{price}</p>
            <p className="text-sm font-medium">{name}</p>
        </Link>
    );
};

export default ProductsItem;
