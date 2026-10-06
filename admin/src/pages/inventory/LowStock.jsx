import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { currency } from '../../config';
import { api } from '../../lib/apiClient';
import { handleAxiosError } from '../../utils/handleAxiosError';

const LowStock = () => {
  const [items, setItems] = useState([]);
  const [threshold, setThreshold] = useState(5);
  const [loading, setLoading] = useState(true);

  const fetchLowStock = async (t) => {
    setLoading(true);
    try {
      const res = await api.get('/api/inventory/low-stock', { params: { threshold: t } });
      setItems(res.data.data.items);
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to load low stock items'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLowStock(threshold); }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-lg font-medium">Low Stock</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Threshold:</span>
          <input
            type="number" min="0" value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            onBlur={() => fetchLowStock(threshold)}
            className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-accent-500 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <p className="py-8 text-center text-gray-400">Loading…</p>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-soft py-12 text-center text-gray-400">
          Nothing below the threshold — stock levels look healthy.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p.id} className="bg-white border border-gray-100 rounded-2xl shadow-soft p-4 flex items-center gap-3">
              <img src={p.images?.[0]} alt="" className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{p.name}</p>
                <p className="text-xs text-gray-400">{p.category} · {currency}{p.price}</p>
                <p className={`text-xs font-medium mt-1 ${p.stock === 0 ? 'text-red-500' : 'text-amber-500'}`}>
                  {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                </p>
              </div>
              <Link to="/inventory/adjust" className="text-xs text-accent-600 hover:underline shrink-0">Restock</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LowStock;
