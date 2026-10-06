const STEPS = [
    { key: 'ORDER_PLACED', label: 'Placed' },
    { key: 'PACKING', label: 'Packing' },
    { key: 'SHIPPED', label: 'Shipped' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' },
];

const CheckIcon = () => (
    <svg viewBox="0 0 20 20" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const OrderTracker = ({ status }) => {
    if (status === 'CANCELLED') {
        return (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-2 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Cancelled
            </div>
        );
    }

    const currentIndex = Math.max(0, STEPS.findIndex((s) => s.key === status));

    return (
        <div className="flex items-center w-full">
            {STEPS.map((step, i) => {
                const done = i < currentIndex;
                const reached = i <= currentIndex;
                return (
                    <div key={step.key} className={`flex items-center ${i === STEPS.length - 1 ? '' : 'flex-1'}`}>
                        <div
                            title={step.label}
                            className={`shrink-0 w-4 h-4 flex items-center justify-center rounded-full border-2 transition-colors duration-250 ${reached ? 'bg-accent-500 border-accent-500 text-white' : 'bg-white border-gray-200 text-gray-300'}`}
                        >
                            {done && <CheckIcon />}
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 ${i < currentIndex ? 'bg-accent-500' : 'bg-gray-200'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default OrderTracker;
