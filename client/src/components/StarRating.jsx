const StarRating = ({ rating = 0, size = 'w-3.5', showCount, count = 0 }) => {
    const filled = Math.round(rating);
    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                        key={i}
                        viewBox="0 0 20 20"
                        className={`${size} ${i <= filled ? 'fill-amber-400' : 'fill-gray-200'}`}
                    >
                        <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" />
                    </svg>
                ))}
            </div>
            {showCount && (
                <span className="text-xs text-gray-400">
                    {count > 0 ? `(${count})` : 'No reviews yet'}
                </span>
            )}
        </div>
    );
};

export default StarRating;
