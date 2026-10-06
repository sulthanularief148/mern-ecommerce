import { Link } from 'react-router-dom';
import { Title } from './Title';

const categories = [
    {
        name: 'Men',
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=75&auto=format&fit=crop',
    },
    {
        name: 'Women',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=75&auto=format&fit=crop',
    },
    {
        name: 'Kids',
        image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=75&auto=format&fit=crop',
    },
    {
        name: 'Accessories',
        image: 'https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=800&q=75&auto=format&fit=crop',
    },
];

const CategoryShowcase = () => (
    <div className="my-20">
        <div className="text-center py-2">
            <Title text1="SHOP BY" text2="CATEGORY" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {categories.map((cat) => (
                <Link
                    key={cat.name}
                    to={`/shop?category=${cat.name}`}
                    className="group relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-2xl block"
                >
                    <img
                        src={cat.image}
                        alt={cat.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
                        <p className="text-white text-2xl heading-display">{cat.name}</p>
                        <span className="text-white text-xs tracking-wide border-b border-white/70 pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                            SHOP NOW
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    </div>
);

export default CategoryShowcase;
