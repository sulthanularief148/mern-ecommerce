import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Title, ProductsItem, SubTitle } from '../components';
import ProductShimmer from './ProductShimmer';

const ProductsGrid = ({ title, subtitle, filterFunction }) => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const { products } = useContext(ShopContext);

    useEffect(() => {
        if (products && products.length > 0) {
            const filtered = filterFunction(products);
            setFilteredProducts(filtered);
            setLoading(false); // Stop shimmer once loaded
        }
    }, [products, filterFunction]);

    return (
        <div className='my-10'>
            {title && (
                <div className="text-center py-8 text-3xl">
                    <Title
                        text1={title.split(" ")[0]}
                        text2={title.split(" ")[1]}
                    />
                    <SubTitle subtitle={subtitle} />
                </div>
            )}

            {loading ? (
                <ProductShimmer count={8} />
            ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-6'>

                    {filteredProducts.length === 0 ? (
                        <p className="text-center col-span-full text-gray-500">No products found matching your filters.</p>
                    ) : (
                        filteredProducts.map((item) => (
                            <ProductsItem key={item._id} id={item._id}
                                name={item.name}
                                price={item.price}
                                image={item.images} />
                        ))
                    )}

                </div>
            )}
        </div>
    );
};

export default ProductsGrid;
