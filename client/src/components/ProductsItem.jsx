import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import QuickView from './QuickView';
import { listingImage } from '../lib/productImage';

const NEW_THRESHOLD_DAYS = 21;

const ProductsItem = ({ product }) => {
    const { currency, isWishlisted, toggleWishlist } = useContext(ShopContext);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [showQuickView, setShowQuickView] = useState(false);

    if (!product) return null;
    const { id, name, price, images, compareAtPrice, bestseller, createdAt, averageRating, reviewCount, stock } = product;

    const isNew = createdAt && (Date.now() - new Date(createdAt).getTime()) < NEW_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;
    const onSale = compareAtPrice > price;
    const discountPct = onSale ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;
    const lowStock = typeof stock === 'number' && stock > 0 && stock <= 5;

    return (
        <>
            <div className="text-gray-700 group relative">
                <Link to={`/product/${id}`} className="cursor-pointer block">
                    <div className="w-full aspect-[4/5] bg-gray-100 relative overflow-hidden rounded-2xl shadow-soft">
                        {!imgLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse z-0"></div>}

                        {images?.[0] && (
                            <img
                                src={listingImage(images[0])}
                                alt={name}
                                loading="lazy"
                                onLoad={() => setImgLoaded(true)}
                                className={`w-full h-full object-cover transition-transform duration-500 ease-out z-10 group-hover:scale-[1.04] ${imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                            />
                        )}

                        {/* Badges */}
                        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1 items-start">
                            {onSale && (
                                <span className="bg-red-500 text-white text-[10px] font-semibold tracking-wide px-2 py-1 rounded-full">
                                    -{discountPct}%
                                </span>
                            )}
                            {bestseller && (
                                <span className="bg-ink text-white text-[10px] font-semibold tracking-wide px-2 py-1 rounded-full">
                                    BESTSELLER
                                </span>
                            )}
                            {!bestseller && isNew && (
                                <span className="bg-accent-500 text-white text-[10px] font-semibold tracking-wide px-2 py-1 rounded-full">
                                    NEW
                                </span>
                            )}
                        </div>

                        {/* Wishlist heart */}
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(id); }}
                            className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-white/90 shadow-soft flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250"
                            aria-label="Toggle wishlist"
                        >
                            <svg viewBox="0 0 24 24" className={`w-4 h-4 ${isWishlisted(id) ? 'text-accent-600' : 'text-gray-400'}`} fill={isWishlisted(id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                                <path d="M12 21s-6.7-4.35-9.3-8.1C1 10.1 1.7 6.6 4.6 5.2c2.2-1.05 4.6-.2 5.9 1.6l1.5 2 1.5-2c1.3-1.8 3.7-2.65 5.9-1.6 2.9 1.4 3.6 4.9 1.9 7.7C18.7 16.65 12 21 12 21z" />
                            </svg>
                        </button>

                        {/* Quick view — desktop hover only */}
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowQuickView(true); }}
                            className="hidden sm:block absolute bottom-0 left-0 right-0 z-20 bg-white/95 text-ink text-xs font-medium tracking-wide py-2.5 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-250"
                        >
                            QUICK VIEW
                        </button>
                    </div>

                    <p className="pt-3 pb-0.5 text-sm font-medium group-hover:text-accent-600 transition-colors duration-250">{name}</p>
                    <StarRating rating={averageRating} size="w-2.5" />
                    <div className="flex items-center gap-2 pt-0.5">
                        <p className="text-sm text-gray-500">{currency}{price}</p>
                        {onSale && <p className="text-xs text-gray-400 line-through">{currency}{compareAtPrice}</p>}
                    </div>
                    {lowStock && <p className="text-[11px] text-red-500 mt-0.5">Only {stock} left</p>}
                </Link>
            </div>

            {showQuickView && <QuickView product={product} onClose={() => setShowQuickView(false)} />}
        </>
    );
};

export default ProductsItem;
