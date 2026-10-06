import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import StarRating from './StarRating';
import { assets } from '../assets';

const QuickView = ({ product, onClose }) => {
    const { currency, addToCart, isWishlisted, toggleWishlist } = useContext(ShopContext);
    const [size, setSize] = useState('');
    const [image, setImage] = useState(product.images?.[0]);

    const handleAdd = () => {
        if (!size) return;
        addToCart(product.id, size);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-card max-w-3xl w-full max-h-[85vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-white/90 shadow-soft flex items-center justify-center text-gray-500 hover:text-ink transition-colors duration-250"
                    aria-label="Close quick view"
                >
                    <img src={assets.cross_icon} className="w-3" alt="" />
                </button>
                <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/2">
                        <img src={image} alt={product.name} className="w-full aspect-square object-cover sm:rounded-l-2xl" />
                        {product.images?.length > 1 && (
                            <div className="flex gap-2 p-3">
                                {product.images.map((img) => (
                                    <img
                                        key={img}
                                        src={img}
                                        onClick={() => setImage(img)}
                                        className={`w-12 h-12 object-cover rounded-xl cursor-pointer border ${image === img ? 'border-accent-500' : 'border-transparent opacity-70'}`}
                                        alt=""
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="sm:w-1/2 p-6 flex flex-col gap-3">
                        <h2 className="text-xl font-medium text-ink">{product.name}</h2>
                        <StarRating rating={product.averageRating} showCount count={product.reviewCount} />
                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-medium">{currency}{product.price}</p>
                            {product.compareAtPrice > product.price && (
                                <p className="text-sm text-gray-400 line-through">{currency}{product.compareAtPrice}</p>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-3">{product.description}</p>

                        <div>
                            <p className="text-sm mb-2">Select Size</p>
                            <div className="flex gap-2 flex-wrap">
                                {product.sizes?.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSize(s)}
                                        className={`border py-1.5 px-3 text-sm rounded-full transition-colors duration-250 ${size === s ? 'border-accent-600 bg-accent-50 text-accent-700' : 'border-gray-200 hover:border-gray-400'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={handleAdd}
                                className="flex-1 bg-ink text-white text-sm py-3 rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250"
                            >
                                ADD TO CART
                            </button>
                            <button
                                onClick={() => toggleWishlist(product.id)}
                                className={`w-12 border rounded-full flex items-center justify-center transition-colors duration-250 ${isWishlisted(product.id) ? 'border-accent-500 text-accent-600' : 'border-gray-200 text-gray-400 hover:text-accent-600'}`}
                                aria-label="Toggle wishlist"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill={isWishlisted(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                                    <path d="M12 21s-6.7-4.35-9.3-8.1C1 10.1 1.7 6.6 4.6 5.2c2.2-1.05 4.6-.2 5.9 1.6l1.5 2 1.5-2c1.3-1.8 3.7-2.65 5.9-1.6 2.9 1.4 3.6 4.9 1.9 7.7C18.7 16.65 12 21 12 21z" />
                                </svg>
                            </button>
                        </div>
                        <Link to={`/product/${product.id}`} onClick={onClose} className="text-xs text-center text-gray-500 hover:text-accent-600 underline mt-1">
                            View full details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickView;
