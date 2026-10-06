import { useContext, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import { getRecentlyViewedIds } from '../lib/recentlyViewed';
import { Title } from './Title';
import ProductsItem from './ProductsItem';

const RecentlyViewed = ({ excludeId }) => {
    const { products } = useContext(ShopContext);

    const items = useMemo(() => {
        const ids = getRecentlyViewedIds().filter((id) => id !== excludeId);
        return ids
            .map((id) => products.find((p) => p.id === id))
            .filter(Boolean)
            .slice(0, 5);
    }, [products, excludeId]);

    if (items.length === 0) return null;

    return (
        <div className="my-24">
            <div className="text-center text-3xl py-2">
                <Title text1="RECENTLY" text2="VIEWED" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {items.map((item) => (
                    <ProductsItem key={item.id} product={item} />
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;
