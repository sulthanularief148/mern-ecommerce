import { useParams } from "react-router-dom";
import { SectionWrapper } from "../hoc";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { DescriptionReview, ProductInfo, RelatedProduct, RecentlyViewed, FrequentlyBoughtTogether, ProductImageZoom } from "../components";
import { recordRecentlyViewed } from "../lib/recentlyViewed";
import { useJsonLd } from "../lib/useJsonLd";

const Product = () => {
  const { productsId } = useParams();
  const { products, productsLoaded, currency } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);

  useEffect(() => {
    const found = products.find((item) => item.id === productsId);
    if (found) {
      setProductData(found);
      recordRecentlyViewed(found.id);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [productsId, products]);

  useJsonLd(productData ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productData.name,
    description: productData.description,
    image: productData.images,
    sku: productData.sku || undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: currency === "₹" ? "INR" : currency,
      price: productData.price,
      availability: productData.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(productData.averageRating ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: productData.averageRating,
        reviewCount: productData.reviewCount,
      },
    } : {}),
  } : null);

  if (!productData) {
    if (!productsLoaded) {
      return <div className="border-t-2 pt-10 text-center text-gray-400 py-20">Loading product…</div>;
    }
    return (
      <div className="border-t-2 pt-10 text-center text-gray-400 py-20">
        Product not found. It may have been removed.
      </div>
    );
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <ProductImageZoom images={productData.images} videoUrl={productData.videoUrl} name={productData.name} />
        <ProductInfo productData={productData} />
      </div>
      <DescriptionReview productId={productData.id} description={productData.description} productData={productData} />
      <FrequentlyBoughtTogether productId={productData.id} />
      {/* Related Products */}
      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
      />
      <RecentlyViewed excludeId={productData.id} />
    </div>
  );
};

export default SectionWrapper(Product, "product");
