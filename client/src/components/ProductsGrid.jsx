import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Title, SubTitle } from './Title';
import ProductsItem from './ProductsItem';
import ProductShimmer from './ProductShimmer';

const ProductsGrid = ({ title, subtitle, filterFunction, pageSize, resetKey }) => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(pageSize || 0);

    const { products, productsLoaded } = useContext(ShopContext);
    const loading = !productsLoaded;

    useEffect(() => {
        if (products && products.length > 0) {
            setFilteredProducts(filterFunction(products));
        }
    }, [products, filterFunction]);

    useEffect(() => {
        if (pageSize) setVisibleCount(pageSize);
    }, [pageSize, resetKey]);

    const visibleProducts = pageSize ? filteredProducts.slice(0, visibleCount) : filteredProducts;
    const hasMore = pageSize && visibleCount < filteredProducts.length;

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
                <>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-8'>

                        {visibleProducts.length === 0 ? (
                            <p className="text-center col-span-full text-gray-400 py-10">No products to show right now. Please check back soon.</p>
                        ) : (
                            visibleProducts.map((item) => (
                                <ProductsItem key={item.id} product={item} />
                            ))
                        )}

                    </div>
                    {hasMore && (
                        <div className="flex justify-center mt-10">
                            <button
                                onClick={() => setVisibleCount((c) => c + pageSize)}
                                className="border border-gray-300 px-8 py-3 text-sm rounded-full hover:border-accent-500 hover:text-accent-600 transition-colors duration-250"
                            >
                                LOAD MORE ({filteredProducts.length - visibleCount} more)
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductsGrid;
