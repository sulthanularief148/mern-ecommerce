import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from 'react-toastify';
import StarRating from './StarRating';
import { estimatedDeliveryDate, DELIVERY_METHODS } from '../constant/checkout';

const ProductInfo = ({ productData }) => {
    const [size, setSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [showSizeChart, setShowSizeChart] = useState(false);
    const { addToCart, currency, isWishlisted, toggleWishlist, navigate } = useContext(ShopContext);

    const requireSize = () => {
        if (!size) {
            toast.error("Please select a size!");
            return false;
        }
        return true;
    };

    const handleAddToCart = () => {
        if (!requireSize()) return;
        for (let i = 0; i < quantity; i++) {
            addToCart(productData.id, size);
        }
        toast.success("Product added to cart!");
    };

    const handleBuyNow = () => {
        if (!requireSize()) return;
        for (let i = 0; i < quantity; i++) {
            addToCart(productData.id, size);
        }
        navigate("/checkout");
    };

    const onSale = productData?.compareAtPrice > productData?.price;
    const discountPct = onSale ? Math.round(((productData.compareAtPrice - productData.price) / productData.compareAtPrice) * 100) : 0;
    const stock = productData?.stock;
    const outOfStock = stock === 0;
    const lowStock = typeof stock === 'number' && stock > 0 && stock <= 5;

    const quickSpecs = [productData?.fabric, productData?.color, productData?.pattern].filter(Boolean);

    return (
        <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
                <h1 className="font-medium text-2xl mt-2">{productData?.name}</h1>
                <button
                    onClick={() => toggleWishlist(productData.id)}
                    className={`mt-2 w-10 h-10 shrink-0 rounded-full border flex items-center justify-center transition-colors duration-250 ${isWishlisted(productData.id) ? 'border-accent-500 text-accent-600' : 'border-gray-200 text-gray-400 hover:text-accent-600'}`}
                    aria-label="Toggle wishlist"
                >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill={isWishlisted(productData.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 21s-6.7-4.35-9.3-8.1C1 10.1 1.7 6.6 4.6 5.2c2.2-1.05 4.6-.2 5.9 1.6l1.5 2 1.5-2c1.3-1.8 3.7-2.65 5.9-1.6 2.9 1.4 3.6 4.9 1.9 7.7C18.7 16.65 12 21 12 21z" />
                    </svg>
                </button>
            </div>

            {quickSpecs.length > 0 && (
                <p className="text-sm text-gray-400 mt-1">{quickSpecs.join(' · ')}</p>
            )}
            {productData?.sku && (
                <p className="text-xs text-gray-300 mt-0.5">SKU: {productData.sku}</p>
            )}

            <div className="mt-2">
                <StarRating rating={productData?.averageRating} showCount count={productData?.reviewCount} />
            </div>

            <div className="flex items-center gap-3 mt-5">
                <p className="text-3xl font-medium">{currency}{productData?.price}</p>
                {onSale && (
                    <>
                        <p className="text-lg text-gray-400 line-through">{currency}{productData.compareAtPrice}</p>
                        <span className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">-{discountPct}%</span>
                    </>
                )}
            </div>
            {lowStock && <p className="text-sm text-red-500 mt-1">Only {stock} left in stock — order soon</p>}
            {outOfStock && <p className="text-sm text-red-500 mt-1">Currently out of stock</p>}

            <p className="mt-5 text-gray-500 md:w-4/5">{productData?.description}</p>

            <div className="flex flex-col gap-4 my-8">
                <div className="flex items-center justify-between md:w-4/5">
                    <p>Select Size</p>
                    {productData?.sizeChart && (
                        <button
                            type="button"
                            onClick={() => setShowSizeChart(true)}
                            className="text-xs text-accent-600 underline underline-offset-2 hover:text-accent-700"
                        >
                            Size Chart
                        </button>
                    )}
                </div>
                <div className="flex gap-2 flex-wrap">
                    {productData?.sizes.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setSize(item)}
                            className={`border py-2 px-4 rounded-full transition-colors duration-250 ${item === size ? "border-accent-600 bg-accent-50 text-accent-700" : "bg-gray-100 border-gray-200 hover:border-gray-400"}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 h-11 text-lg text-gray-500 hover:text-ink">−</button>
                    <span className="w-8 text-center text-sm">{quantity}</span>
                    <button onClick={() => setQuantity((q) => q + 1)} className="w-9 h-11 text-lg text-gray-500 hover:text-ink">+</button>
                </div>
                <button
                    onClick={handleAddToCart}
                    disabled={outOfStock}
                    className="flex-1 bg-ink text-white text-sm py-3 px-8 rounded-full hover:bg-accent-600 hover:shadow-soft active:bg-accent-700 transition-all duration-250 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {outOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
                </button>
                <button
                    onClick={handleBuyNow}
                    disabled={outOfStock}
                    className="flex-1 border border-ink text-ink text-sm py-3 px-8 rounded-full hover:bg-ink hover:text-white transition-colors duration-250 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    BUY NOW
                </button>
            </div>

            <div className="mt-5 flex items-start gap-2 text-sm text-gray-500 md:w-4/5">
                <span>🚚</span>
                <p>
                    Get it by <strong className="text-ink">{estimatedDeliveryDate('STANDARD')}</strong> with standard delivery
                    ({currency}{DELIVERY_METHODS.STANDARD.fee}, free over {currency}999), or by{' '}
                    <strong className="text-ink">{estimatedDeliveryDate('EXPRESS')}</strong> with express delivery.
                </p>
            </div>

            <hr className="mt-8 w-4/5 border-gray-200" />

            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-2">
                <p className="flex items-center gap-2">🔒 Secure payment via Stripe &amp; Razorpay</p>
                <p className="flex items-center gap-2">🚚 Cash on delivery available on this product</p>
                <p className="flex items-center gap-2">↩️ Easy return and exchange within 7 days</p>
                <p className="flex items-center gap-2">🌱 Sustainably made — see our story on the About page</p>
            </div>

            {showSizeChart && productData?.sizeChart && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowSizeChart(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-card max-w-md w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-medium text-lg">Size Chart</p>
                            <button onClick={() => setShowSizeChart(false)} className="text-gray-400 hover:text-ink text-xl leading-none">&times;</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        {Object.keys(productData.sizeChart[0]).map((col) => (
                                            <th key={col} className="py-2 pr-4 capitalize text-gray-500 font-medium">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {productData.sizeChart.map((row, i) => (
                                        <tr key={i} className="border-b border-gray-100 last:border-0">
                                            {Object.values(row).map((val, j) => (
                                                <td key={j} className="py-2 pr-4">{val}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">Measurements may vary slightly by ±1 inch.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductInfo;
