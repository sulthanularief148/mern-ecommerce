const STEPS = [
    { key: 'ORDER_PLACED', label: 'Order Placed' },
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

// A visual pipeline of the order's journey from placement to delivery —
// used on both the customer order page and the admin order list, so the
// "what happens after this order ships" question always has a clear answer.
const OrderTracker = ({ status, compact = false }) => {
    if (status === 'CANCELLED') {
        return (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                This order was cancelled.
            </div>
        );
    }

    const currentIndex = Math.max(0, STEPS.findIndex((s) => s.key === status));

    return (
        <div className={`flex items-start ${compact ? 'gap-0' : 'gap-0 py-2'}`}>
            {STEPS.map((step, i) => {
                const done = i < currentIndex;
                const active = i === currentIndex;
                const reached = i <= currentIndex;
                return (
                    <div key={step.key} className={`flex flex-col items-center ${i === STEPS.length - 1 ? '' : 'flex-1'}`}>
                        <div className="flex items-center w-full">
                            <div
                                className={`shrink-0 flex items-center justify-center rounded-full border-2 transition-colors duration-250 ${compact ? 'w-5 h-5' : 'w-7 h-7'} ${reached
                                    ? 'bg-accent-500 border-accent-500 text-white'
                                    : 'bg-white border-gray-200 text-gray-300'
                                    } ${active ? 'ring-4 ring-accent-100' : ''}`}
                            >
                                {done ? <CheckIcon /> : <span className={`rounded-full bg-current ${compact ? 'w-1.5 h-1.5' : 'w-2 h-2'} ${reached ? 'bg-white' : 'bg-gray-300'}`} />}
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-1 transition-colors duration-250 ${i < currentIndex ? 'bg-accent-500' : 'bg-gray-200'}`} />
                            )}
                        </div>
                        {!compact && (
                            <p className={`text-[11px] mt-1.5 text-center leading-tight ${active ? 'text-ink font-medium' : reached ? 'text-gray-500' : 'text-gray-300'}`}>
                                {step.label}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default OrderTracker;
