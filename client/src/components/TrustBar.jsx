const items = [
    {
        title: 'Free Shipping',
        subtitle: 'On orders over ₹999',
        icon: (
            <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7zM6.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        ),
    },
    {
        title: 'Secure Payment',
        subtitle: 'Stripe & Razorpay',
        icon: (
            <path d="M12 2l8 3.5v5.7c0 5-3.4 8.9-8 10.3-4.6-1.4-8-5.3-8-10.3V5.5L12 2zm-1.2 13l6-6-1.4-1.4-4.6 4.6-2-2L7.4 11.6 10.8 15z" />
        ),
    },
    {
        title: 'Easy Returns',
        subtitle: '7-day return window',
        icon: (
            <path d="M12 5V2L7 6l5 4V7a5 5 0 11-4.9 6H4.9A7 7 0 1012 5z" />
        ),
    },
    {
        title: '24/7 Support',
        subtitle: "We're here to help",
        icon: (
            <path d="M12 3a8 8 0 00-8 8v5a2 2 0 002 2h2v-7H6v-1a6 6 0 1112 0v1h-2v7h2a2 2 0 002-2v-4a8 8 0 00-8-9z" />
        ),
    },
];

const TrustBar = () => (
    <div className="border-y border-gray-100 bg-accent-50/40">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8">
            {items.map((item) => (
                <div key={item.title} className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 text-center sm:text-left px-2">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0 fill-accent-600">{item.icon}</svg>
                    <div>
                        <p className="text-sm font-medium text-ink">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default TrustBar;
