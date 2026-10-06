import { Title } from './Title';
import StarRating from './StarRating';

const testimonials = [
    {
        name: 'Priya S.',
        location: 'Chennai',
        quote: 'The fabric quality is genuinely different — soft, breathable, and it still looks new after a dozen washes. Delivery was quick too.',
        rating: 5,
    },
    {
        name: 'Arjun M.',
        location: 'Bengaluru',
        quote: "Love that I can actually see the sustainability story behind each piece. It's rare to find a brand that backs it up with quality.",
        rating: 5,
    },
    {
        name: 'Fatima R.',
        location: 'Hyderabad',
        quote: 'Sizing was spot on and the return process was painless when I needed to exchange one item. Will definitely shop here again.',
        rating: 4,
    },
];

const Testimonials = () => (
    <div className="my-24">
        <div className="text-center py-2">
            <Title text1="WHAT OUR" text2="CUSTOMERS SAY" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            {testimonials.map((t) => (
                <div key={t.name} className="border border-gray-50 rounded-2xl p-6 bg-white shadow-soft hover:shadow-card transition-shadow duration-250 flex flex-col gap-3">
                    <StarRating rating={t.rating} />
                    <p className="text-sm text-gray-600 flex-1">"{t.quote}"</p>
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center text-xs font-semibold">
                            {t.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-ink">{t.name}</p>
                            <p className="text-xs text-gray-400">{t.location}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default Testimonials;
