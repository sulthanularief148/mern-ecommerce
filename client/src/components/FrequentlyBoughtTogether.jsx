import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import * as productApi from "../services/productApi";
import { listingImage } from "../lib/productImage";

const FrequentlyBoughtTogether = ({ productId }) => {
    const { currency, addToCart } = useContext(ShopContext);
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        productApi.fetchFrequentlyBoughtTogether(productId)
            .then((products) => {
                if (cancelled) return;
                setItems(products);
                setSelected(new Set(products.map((p) => p.id)));
            })
            .catch(() => { if (!cancelled) setItems([]); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [productId]);

    if (loading || items.length === 0) return null;

    const toggle = (id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const selectedItems = items.filter((p) => selected.has(p.id));
    const total = selectedItems.reduce((sum, p) => sum + Number(p.price), 0);

    const addSelectedToCart = () => {
        selectedItems.forEach((p) => {
            const size = p.sizes?.[0];
            if (size) addToCart(p.id, size);
        });
    };

    return (
        <div className="mt-16 border-t border-gray-100 pt-10">
            <p className="text-xl font-medium text-ink mb-6">Frequently Bought Together</p>
            <div className="flex flex-wrap items-center gap-4">
                {items.map((p, idx) => (
                    <div key={p.id} className="flex items-center gap-4">
                        <label className="flex flex-col items-center gap-2 cursor-pointer w-24">
                            <div className="relative">
                                <img src={listingImage(p.images?.[0])} alt={p.name} className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
                                <input
                                    type="checkbox"
                                    checked={selected.has(p.id)}
                                    onChange={() => toggle(p.id)}
                                    className="absolute -top-1.5 -right-1.5 w-4 h-4"
                                />
                            </div>
                            <Link to={`/product/${p.id}`} className="text-xs text-center text-gray-600 hover:text-accent-600 line-clamp-2">{p.name}</Link>
                            <p className="text-xs font-medium">{currency}{p.price}</p>
                        </label>
                        {idx < items.length - 1 && <span className="text-gray-300 text-lg">+</span>}
                    </div>
                ))}
            </div>
            <div className="mt-5 flex items-center gap-4">
                <p className="text-sm text-gray-600">
                    Total for {selectedItems.length} item{selectedItems.length === 1 ? '' : 's'}:{' '}
                    <span className="font-semibold text-ink">{currency}{total}</span>
                </p>
                <button
                    type="button"
                    onClick={addSelectedToCart}
                    disabled={selectedItems.length === 0}
                    className="bg-ink text-white text-sm px-6 py-2.5 rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-40"
                >
                    Add Selected to Cart
                </button>
            </div>
        </div>
    );
};

export default FrequentlyBoughtTogether;
