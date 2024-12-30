import { assets } from "../assets";
import { collectionContent } from "../constant";

const Filters = ({ showFilter, toggleFilter, filters }) => {
    return (
        <div className="min-w-60 sm:w-auto">
            <p
                className="text-black flex items-center gap-4 cursor-pointer"
                onClick={() => toggleFilter(!showFilter)}
                aria-expanded={showFilter}
            >
                {collectionContent.filterTitle}
                <img
                    src={assets.dropdown_icon}
                    alt="Dropdown"
                    className={`sm:hidden h-3 ${showFilter ? "rotate-90" : ""}`}
                />
            </p>

            {filters.map(({ title, options }) => (
                <div key={title} className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? "" : "hidden"} sm:block`}>
                    <p className="mb-3 text-sm font-medium">{title}</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        {options.map((option) => (
                            <p key={option} className="flex gap-2">
                                <input
                                    type="checkbox"
                                    className="w-3"
                                    value={option}
                                    onChange={(e) => toggleFilter(e, title.toUpperCase())}
                                />
                                {option}
                            </p>
                        ))}
                    </div>
                </div>
            ))}

        </div>
    );
};
export default Filters;