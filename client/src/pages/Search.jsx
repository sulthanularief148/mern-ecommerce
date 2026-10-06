import { useContext, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { SectionWrapper } from "../hoc"
import { ProductsGrid, Title } from "../components"
import { ShopContext } from "../context/ShopContext"

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  const { products } = useContext(ShopContext);

  const matchCount = useMemo(() => {
    if (!query.trim()) return products.length;
    const q = query.trim().toLowerCase();
    return products.filter((p) =>
      p.name.toLowerCase().includes(q)
      || p.category?.toLowerCase().includes(q)
      || p.subCategory?.toLowerCase().includes(q)
      || p.fabric?.toLowerCase().includes(q)
      || p.collectionName?.toLowerCase().includes(q)
      || p.sku?.toLowerCase().includes(q)
    ).length;
  }, [query, products]);

  const filterFunction = (allProducts) => {
    if (!query.trim()) return allProducts;
    const q = query.trim().toLowerCase();
    return allProducts.filter((p) =>
      p.name.toLowerCase().includes(q)
      || p.category?.toLowerCase().includes(q)
      || p.subCategory?.toLowerCase().includes(q)
      || p.fabric?.toLowerCase().includes(q)
      || p.collectionName?.toLowerCase().includes(q)
      || p.sku?.toLowerCase().includes(q)
    );
  };

  const submitSearch = (e) => {
    e.preventDefault();
    setSearchParams(inputValue.trim() ? { q: inputValue.trim() } : {});
  };

  return (
    <div className="border-t pt-10">
      <Title text1="SEARCH" text2="RESULTS" withBorder />

      <form onSubmit={submitSearch} className="mt-4 mb-2 flex items-center gap-2 max-w-xl">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="text"
          placeholder="Search by product, category, fabric, collection or SKU..."
          className="flex-1 border border-gray-300 rounded-full px-5 py-2 text-sm outline-none focus:border-accent-500 transition-colors duration-250"
        />
        <button
          type="submit"
          className="bg-ink text-white text-sm px-6 py-2 rounded-full hover:bg-accent-600 transition-colors duration-250"
        >
          Search
        </button>
      </form>

      <p className="text-sm text-gray-500 mb-4">
        {query.trim() ? (
          <>{matchCount} result{matchCount === 1 ? '' : 's'} for <span className="text-ink font-medium">&ldquo;{query}&rdquo;</span></>
        ) : (
          'Showing all products — type above to search by name, category, fabric, collection, or SKU.'
        )}
      </p>

      <ProductsGrid filterFunction={filterFunction} pageSize={12} resetKey={query} />
    </div>
  );
};

export default SectionWrapper(Search, "search");
