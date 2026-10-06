import { SectionWrapper } from "../hoc"
import { ProductsGrid, Filters, SortAndTitle } from "../components"
import { useContext, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { ShopContext } from "../context/ShopContext"

const uniqueSorted = (values) => [...new Set(values.filter(Boolean))].sort();

const Collection = () => {
  const [searchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const [categories, setCategories] = useState(() => {
    const fromUrl = searchParams.get('category');
    return fromUrl ? [fromUrl.toLowerCase()] : [];
  });
  const [subCategory, setSubCategory] = useState([]);
  const [fabric, setFabric] = useState([]);
  const [color, setColor] = useState([]);
  const [pattern, setPattern] = useState([]);
  const [occasion, setOccasion] = useState([]);
  const [sortBy, setSortBy] = useState("relevent");
  const [inStockOnly, setInStockOnly] = useState(false);
  const { search, showSearch, products } = useContext(ShopContext);

  const priceBounds = useMemo(() => {
    if (products.length === 0) return [0, 5000];
    const prices = products.map((p) => Number(p.price));
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [products]);
  const [priceRange, setPriceRange] = useState(priceBounds);

  // Once real product prices load, widen the default range to match —
  // otherwise the initial [0, 5000] placeholder could clip real products.
  useEffect(() => {
    setPriceRange(priceBounds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length]);

  const dynamicOptions = useMemo(() => ({
    CATEGORIES: uniqueSorted(products.map((p) => p.category)),
    SUBCATEGORY: uniqueSorted(products.map((p) => p.subCategory)),
    FABRIC: uniqueSorted(products.map((p) => p.fabric)),
    COLOR: uniqueSorted(products.map((p) => p.color)),
    PATTERN: uniqueSorted(products.map((p) => p.pattern)),
    OCCASION: uniqueSorted(products.map((p) => p.occasion)),
  }), [products]);

  const filterState = { categories, subCategory, fabric, color, pattern, occasion };
  const setters = {
    CATEGORIES: setCategories, SUBCATEGORY: setSubCategory, FABRIC: setFabric,
    COLOR: setColor, PATTERN: setPattern, OCCASION: setOccasion,
  };
  const keys = {
    CATEGORIES: 'categories', SUBCATEGORY: 'subCategory', FABRIC: 'fabric',
    COLOR: 'color', PATTERN: 'pattern', OCCASION: 'occasion',
  };

  // Lets banner/nav links like /collection?category=Men pre-filter the grid.
  useEffect(() => {
    const fromUrl = searchParams.get('category');
    if (fromUrl) setCategories([fromUrl.toLowerCase()]);
  }, [searchParams]);

  const toggleFilter = (e, filterType) => {
    const value = e.target.value.toLowerCase();
    const setter = setters[filterType];
    if (!setter) return;
    setter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const clearAll = () => {
    setCategories([]); setSubCategory([]); setFabric([]); setColor([]);
    setPattern([]); setOccasion([]); setInStockOnly(false); setPriceRange(priceBounds);
  };

  const filterProducts = (allProducts) => {
    if (search && showSearch) {
      const q = search.toLowerCase();
      return allProducts.filter((product) =>
        product.name.toLowerCase().includes(q)
        || product.category?.toLowerCase().includes(q)
        || product.fabric?.toLowerCase().includes(q)
        || product.collectionName?.toLowerCase().includes(q)
        || product.sku?.toLowerCase().includes(q)
      );
    }

    return allProducts.filter((product) => {
      const matches = (arr, field) => arr.length === 0 || arr.includes(product[field]?.toLowerCase());
      const priceMatch = Number(product.price) >= priceRange[0] && Number(product.price) <= priceRange[1];
      const stockMatch = !inStockOnly || product.stock > 0;

      return matches(categories, 'category')
        && matches(subCategory, 'subCategory')
        && matches(fabric, 'fabric')
        && matches(color, 'color')
        && matches(pattern, 'pattern')
        && matches(occasion, 'occasion')
        && priceMatch
        && stockMatch;
    });
  };

  const sortProducts = (list) => {
    switch (sortBy) {
      case "low-high":
        return [...list].sort((a, b) => a.price - b.price);
      case "high-low":
        return [...list].sort((a, b) => b.price - a.price);
      case "newest":
        return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return list;
    }
  };

  const filtersConfig = [
    { title: "CATEGORIES", options: dynamicOptions.CATEGORIES },
    { title: "SUBCATEGORY", options: dynamicOptions.SUBCATEGORY },
    { title: "FABRIC", options: dynamicOptions.FABRIC },
    { title: "COLOR", options: dynamicOptions.COLOR },
    { title: "PATTERN", options: dynamicOptions.PATTERN },
    { title: "OCCASION", options: dynamicOptions.OCCASION },
  ];

  const resetKey = JSON.stringify({ categories, subCategory, fabric, color, pattern, occasion, priceRange, inStockOnly, sortBy, search: showSearch ? search : '' });

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      <Filters
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        toggleFilter={toggleFilter}
        filters={filtersConfig}
        selected={{
          CATEGORIES: categories, SUBCATEGORY: subCategory, FABRIC: fabric,
          COLOR: color, PATTERN: pattern, OCCASION: occasion,
        }}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        priceBounds={priceBounds}
        inStockOnly={inStockOnly}
        onInStockChange={setInStockOnly}
        onClearAll={clearAll}
      />
      <div className="flex-1">
        <SortAndTitle sortBy={sortBy} setSortBy={setSortBy} />
        <ProductsGrid
          showContainer={false}
          filterFunction={(items) => sortProducts(filterProducts(items))}
          pageSize={12}
          resetKey={resetKey}
        />
      </div>
    </div>
  );
};

export default SectionWrapper(Collection, "collection");
