const stats = [
    { value: '50,000+', label: 'Happy Customers' },
    { value: '4.8★', label: 'Average Rating' },
    { value: '120+', label: 'Sustainable Styles' },
    { value: '7-Day', label: 'Easy Returns' },
];

const StatsGrid = () => (
    <div className="my-20 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
            <div key={s.label} className="text-center border border-gray-100 rounded-2xl py-8 px-3 bg-accent-50/40 shadow-soft">
                <p className="heading-display text-3xl sm:text-4xl text-accent-700">{s.value}</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 tracking-wide">{s.label}</p>
            </div>
        ))}
    </div>
);

export default StatsGrid;
