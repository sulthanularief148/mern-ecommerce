import { Link } from 'react-router-dom';

const PromoBanner = () => (
    <div className="my-20 relative rounded-2xl overflow-hidden">
        <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=75&auto=format&fit=crop"
            alt="Seasonal sale"
            loading="lazy"
            className="w-full h-[280px] sm:h-[360px] object-cover"
        />
        <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-center px-6">
            <p className="text-accent-100 text-sm tracking-[0.2em] font-medium mb-3">LIMITED TIME</p>
            <h2 className="text-white text-3xl sm:text-5xl heading-display mb-4">End of Season Sale</h2>
            <p className="text-white/90 text-sm sm:text-base mb-6 max-w-md">
                Up to 40% off on select styles — refresh your wardrobe sustainably.
            </p>
            <Link
                to="/shop"
                className="bg-white text-ink text-sm font-medium px-8 py-3 rounded-full hover:bg-accent-500 hover:text-white transition-colors duration-250"
            >
                SHOP THE SALE
            </Link>
        </div>
    </div>
);

export default PromoBanner;
