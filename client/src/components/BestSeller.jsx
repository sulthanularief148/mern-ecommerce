import ProductsGrid from './ProductsGrid';
import { bestSellerContent } from '../constant';

const BestSeller = () => {
  return (
    <ProductsGrid
      title={bestSellerContent.title}
      subtitle={bestSellerContent.subtitle}
      filterFunction={(products) => products.filter((product) => product.bestseller === true).slice(0, 5)}
    />
  );
};

export default BestSeller;
