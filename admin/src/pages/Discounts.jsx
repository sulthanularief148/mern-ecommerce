import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { currency } from '../config';
import { api } from '../lib/apiClient';
import { handleAxiosError } from '../utils/handleAxiosError';

const CATEGORY_OPTIONS = ['Men', 'Women', 'Kids', 'Accessories'];

const Discounts = () => {
  const [scope, setScope] = useState('CATEGORY');
  const [scopeValue, setScopeValue] = useState('Men');
  const [type, setType] = useState('PERCENT');
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [onSale, setOnSale] = useState([]);
  const [loadingSale, setLoadingSale] = useState(true);

  const fetchOnSale = async () => {
    setLoadingSale(true);
    try {
      const res = await api.get('/api/discounts/on-sale');
      setOnSale(res.data.data.products);
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to load products on sale'));
    } finally {
      setLoadingSale(false);
    }
  };

  useEffect(() => { fetchOnSale(); }, []);

  const onApply = async (e) => {
    e.preventDefault();
    if (!value) { toast.error('Enter a discount value'); return; }
    setSubmitting(true);
    try {
      const res = await api.post('/api/discounts/apply', {
        scope, scopeValue: scope === 'ALL' ? undefined : scopeValue, type, value: Number(value),
      });
      toast.success(`Applied discount to ${res.data.data.updatedCount} product(s)`);
      setValue('');
      fetchOnSale();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to apply discount'));
    } finally {
      setSubmitting(false);
    }
  };

  const clearOne = async (productId) => {
    try {
      await api.post('/api/discounts/clear', { scope: 'PRODUCTS', productIds: [productId] });
      toast.success('Discount removed');
      fetchOnSale();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to clear discount'));
    }
  };

  const clearAll = async () => {
    try {
      const res = await api.post('/api/discounts/clear', { scope: 'ALL' });
      toast.success(`Cleared discounts on ${res.data.data.updatedCount} product(s)`);
      fetchOnSale();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to clear discounts'));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg font-medium">Discounts</p>
      <p className="text-xs text-gray-400 -mt-4">
        Applies a sale price in bulk (sets the product&apos;s price and shows the original as a crossed-out compare-at price). For code-based discounts, use Coupons instead.
      </p>

      <form onSubmit={onApply} className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6 flex flex-col gap-4 max-w-2xl">
        <p className="font-medium">Apply a Sale</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <p className="text-sm mb-2">Apply to</p>
            <select value={scope} onChange={(e) => setScope(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-sm">
              <option value="CATEGORY">Category</option>
              <option value="SUBCATEGORY">Sub-category</option>
              <option value="ALL">All products</option>
            </select>
          </div>
          {scope !== 'ALL' && (
            <div>
              <p className="text-sm mb-2">{scope === 'CATEGORY' ? 'Category' : 'Sub-category'}</p>
              {scope === 'CATEGORY' ? (
                <select value={scopeValue} onChange={(e) => setScopeValue(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-sm">
                  {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : (
                <input value={scopeValue} onChange={(e) => setScopeValue(e.target.value)} placeholder="e.g. Topwear" className="px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-sm" />
              )}
            </div>
          )}
          <div>
            <p className="text-sm mb-2">Discount type</p>
            <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-sm">
              <option value="PERCENT">Percent %</option>
              <option value="FLAT">Flat {currency}</option>
            </select>
          </div>
          <div>
            <p className="text-sm mb-2">Value</p>
            <input
              type="number" min="0" step="0.01" value={value} onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'PERCENT' ? 'e.g. 20' : 'e.g. 100'}
              className="w-32 px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-sm"
            />
          </div>
          <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-ink text-white rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-60 text-sm">
            {submitting ? 'Applying…' : 'Apply Discount'}
          </button>
        </div>
      </form>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="font-medium">Currently on Sale ({onSale.length})</p>
          {onSale.length > 0 && (
            <button onClick={clearAll} className="text-xs text-red-500 hover:underline">Clear all discounts</button>
          )}
        </div>
        {loadingSale ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : onSale.length === 0 ? (
          <p className="text-sm text-gray-400">No products are currently discounted.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {onSale.map((p) => (
              <div key={p.id} className="flex items-center gap-3 text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <img src={p.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{p.name}</p>
                  <p className="text-xs">
                    <span className="text-accent-600 font-medium">{currency}{p.price}</span>{' '}
                    <span className="text-gray-400 line-through">{currency}{p.compareAtPrice}</span>
                  </p>
                </div>
                <button onClick={() => clearOne(p.id)} className="text-xs text-gray-400 hover:text-red-500">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discounts;
