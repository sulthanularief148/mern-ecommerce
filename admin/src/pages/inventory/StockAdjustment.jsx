import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../lib/apiClient';
import { handleAxiosError } from '../../utils/handleAxiosError';

const StockAdjustment = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [delta, setDelta] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activity, setActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  const fetchActivity = async () => {
    setLoadingActivity(true);
    try {
      const res = await api.get('/api/inventory/activity');
      setActivity(res.data.data.adjustments);
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to load activity'));
    } finally {
      setLoadingActivity(false);
    }
  };

  useEffect(() => {
    api.get('/api/products/list').then((res) => setProducts(res.data.data.products));
    fetchActivity();
  }, []);

  const selectedProduct = products.find((p) => p.id === productId);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !delta || !reason.trim()) {
      toast.error('Select a product, a quantity change, and a reason');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/api/inventory/adjust', { productId, delta: Number(delta), reason: reason.trim() });
      toast.success(`Stock updated — now ${res.data.data.product.stock}`);
      setProductId(''); setDelta(''); setReason('');
      const refreshed = await api.get('/api/products/list');
      setProducts(refreshed.data.data.products);
      fetchActivity();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to adjust stock'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg font-medium">Stock Adjustment</p>

      <form onSubmit={onSubmit} className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6 flex flex-col gap-4 max-w-xl">
        <div>
          <p className="text-sm mb-2">Product</p>
          <select
            value={productId} onChange={(e) => setProductId(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-sm"
          >
            <option value="">Select a product…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} (current: {p.stock})</option>
            ))}
          </select>
          {selectedProduct && (
            <p className="text-xs text-gray-400 mt-1">Current stock: {selectedProduct.stock}</p>
          )}
        </div>

        <div className="flex gap-4">
          <div>
            <p className="text-sm mb-2">Quantity change</p>
            <input
              type="number" value={delta} onChange={(e) => setDelta(e.target.value)}
              placeholder="e.g. 20 or -5"
              className="w-40 px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">Positive to add stock, negative to remove.</p>
          </div>
        </div>

        <div>
          <p className="text-sm mb-2">Reason</p>
          <input
            value={reason} onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. New shipment received, damaged units, stocktake correction"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-sm"
          />
        </div>

        <button
          type="submit" disabled={submitting}
          className="self-start px-8 py-2.5 bg-ink text-white rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-60 text-sm"
        >
          {submitting ? 'Saving…' : 'Apply Adjustment'}
        </button>
      </form>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
        <p className="font-medium mb-4">Recent Activity</p>
        {loadingActivity ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : activity.length === 0 ? (
          <p className="text-sm text-gray-400">No adjustments yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {activity.map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={a.product?.images?.[0]} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate">{a.product?.name}</p>
                    <p className="text-xs text-gray-400">{a.reason} · {a.adjustedBy?.name}</p>
                  </div>
                </div>
                <p className={`font-medium shrink-0 ${a.delta > 0 ? 'text-accent-600' : 'text-red-500'}`}>
                  {a.delta > 0 ? '+' : ''}{a.delta} → {a.newStock}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockAdjustment;
