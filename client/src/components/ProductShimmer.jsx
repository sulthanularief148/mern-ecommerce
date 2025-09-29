import React from 'react';

const ProductShimmer = ({ count = 8 }) => {
    const shimmerArray = Array.from({ length: count });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shimmerArray.map((_, index) => (
                <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 animate-pulse shadow-sm"
                >
                    <div className="bg-gray-300 h-48 w-full rounded-md mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/3 mt-4"></div>
                </div>
            ))}
        </div>
    );
};

export default ProductShimmer;
