import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { currency } from '../../config';
import { api } from '../../lib/apiClient';
import { handleAxiosError } from '../../utils/handleAxiosError';

const Stock = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStock = async (q) => {
    setLoading(true);
    try {
      const res = await api.get('/api/inventory/stock', { params: { limit: 100, search: q || undefined } });
      setItems(res.data.data.items);
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to load stock'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStock(); }, []);

  const onSearch = (e) => {
    e.preventDefault();
    fetchStock(search);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-medium">Stock Overview</p>
        <form onSubmit={onSearch} className="flex gap-2">
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU"
            className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-sm transition-colors duration-250"
          />
        </form>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500">
          <p>Image</p><p>Product</p><p>Category</p><p>Price</p><p>Stock</p>
        </div>
        {loading ? (
          <p className="py-8 text-center text-gray-400">Loading…</p>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-gray-400">No products found.</p>
        ) : items.map((p) => (
          <div key={p.id} className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 px-4 py-3 border-t border-gray-50 text-sm">
            <img src={p.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <p>{p.name}</p>
              {p.sku && <p className="text-xs text-gray-400">{p.sku}</p>}
            </div>
            <p className="hidden md:block text-gray-500">{p.category}</p>
            <p className="hidden md:block">{currency}{p.price}</p>
            <p className={p.stock === 0 ? 'text-red-500 font-medium' : p.stock <= 5 ? 'text-amber-500 font-medium' : ''}>{p.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stock;
