import { Link } from 'react-router-dom';

const tiles = [
    {
        title: 'New Arrivals',
        subtitle: 'Fresh drops, every week',
        cta: 'Explore New In',
        to: '/shop',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1000&q=75&auto=format&fit=crop',
    },
    {
        title: 'Best Sellers',
        subtitle: 'The pieces everyone keeps coming back for',
        cta: 'Shop Best Sellers',
        to: '/shop',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=75&auto=format&fit=crop',
    },
];

const EditorsPicks = () => (
    <div className="my-20 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tiles.map((tile) => (
            <Link
                key={tile.title}
                to={tile.to}
                className="group relative aspect-[16/10] overflow-hidden rounded-2xl block"
            >
                <img
                    src={tile.image}
                    alt={tile.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                    <p className="text-white/80 text-xs tracking-[0.2em] mb-1">{tile.subtitle}</p>
                    <div className="flex items-center justify-between">
                        <p className="text-white text-2xl heading-display">{tile.title}</p>
                        <span className="text-white text-xs font-medium tracking-wide border border-white/70 rounded-full px-4 py-2 group-hover:bg-white group-hover:text-ink transition-colors duration-250">
                            {tile.cta}
                        </span>
                    </div>
                </div>
            </Link>
        ))}
    </div>
);

export default EditorsPicks;
