import ProductsGrid from './ProductsGrid';
import { latestCollectionContent } from '../constant';
const LatestCollection = () => {
    return (
        <ProductsGrid
            title={latestCollectionContent.title}
            subtitle={latestCollectionContent.subtitle}
            filterFunction={(products) => products.slice(0, 10)}
        />
    );
};

export default LatestCollection;
