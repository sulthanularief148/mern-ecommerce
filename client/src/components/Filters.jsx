import { assets } from "../assets";
import { collectionContent } from "../constant";

const Filters = ({
    showFilter, setShowFilter, toggleFilter, filters, selected = {},
    priceRange, onPriceRangeChange, priceBounds,
    inStockOnly, onInStockChange,
    onClearAll,
}) => {
    const hasActiveFilters = Object.values(selected).some((arr) => arr.length > 0)
        || inStockOnly
        || (priceRange && priceBounds && (priceRange[0] > priceBounds[0] || priceRange[1] < priceBounds[1]));

    return (
        <div className="min-w-60 sm:w-auto">
            <div className="flex items-center justify-between">
                <p
                    className="text-black flex items-center gap-4 cursor-pointer"
                    onClick={() => setShowFilter((prev) => !prev)}
                    aria-expanded={showFilter}
                >
                    {collectionContent.filterTitle}
                    <img
                        src={assets.dropdown_icon}
                        alt="Dropdown"
                        className={`sm:hidden h-3 ${showFilter ? "rotate-90" : ""}`}
                    />
                </p>
                {hasActiveFilters && onClearAll && (
                    <button
                        type="button"
                        onClick={onClearAll}
                        className="hidden sm:block text-xs text-accent-600 hover:underline"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {filters.map(({ title, options }) => (
                options.length > 0 && (
                    <div key={title} className={`border border-gray-100 rounded-2xl pl-5 pr-3 py-4 my-4 bg-white shadow-soft ${showFilter ? "" : "hidden"} sm:block`}>
                        <p className="mb-3 text-sm font-medium">{title}</p>
                        <div className="flex flex-col gap-2 text-sm font-light text-gray-700 max-h-48 overflow-y-auto pr-2">
                            {options.map((option) => (
                                <p key={option} className="flex gap-2">
                                    <input
                                        type="checkbox"
                                        className="w-3"
                                        value={option}
                                        checked={(selected[title.toUpperCase()] || []).includes(option.toLowerCase())}
                                        onChange={(e) => toggleFilter(e, title.toUpperCase())}
                                    />
                                    {option}
                                </p>
                            ))}
                        </div>
                    </div>
                )
            ))}

            {priceRange && priceBounds && (
                <div className={`border border-gray-100 rounded-2xl pl-5 pr-3 py-4 my-4 bg-white shadow-soft ${showFilter ? "" : "hidden"} sm:block`}>
                    <p className="mb-3 text-sm font-medium">PRICE</p>
                    <div className="flex items-center gap-2 text-sm">
                        <input
                            type="number"
                            min={priceBounds[0]}
                            max={priceRange[1]}
                            value={priceRange[0]}
                            onChange={(e) => onPriceRangeChange([Number(e.target.value) || 0, priceRange[1]])}
                            className="w-20 border border-gray-200 rounded-xl px-2 py-1"
                        />
                        <span className="text-gray-400">to</span>
                        <input
                            type="number"
                            min={priceRange[0]}
                            max={priceBounds[1]}
                            value={priceRange[1]}
                            onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value) || priceBounds[1]])}
                            className="w-20 border border-gray-200 rounded-xl px-2 py-1"
                        />
                    </div>
                </div>
            )}

            {onInStockChange && (
                <div className={`border border-gray-100 rounded-2xl pl-5 pr-3 py-4 my-4 bg-white shadow-soft ${showFilter ? "" : "hidden"} sm:block`}>
                    <p className="mb-3 text-sm font-medium">AVAILABILITY</p>
                    <label className="flex gap-2 items-center text-sm font-light text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-3"
                            checked={inStockOnly}
                            onChange={(e) => onInStockChange(e.target.checked)}
                        />
                        In stock only
                    </label>
                </div>
            )}
        </div>
    );
};
export default Filters;