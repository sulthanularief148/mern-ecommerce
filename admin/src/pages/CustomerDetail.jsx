import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { currency } from '../config';
import { api } from '../lib/apiClient';
import { handleAxiosError } from '../utils/handleAxiosError';

const STATUS_LABELS = {
  ORDER_PLACED: 'Order Placed', PACKING: 'Packing', SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery', DELIVERED: 'Delivered', CANCELLED: 'Cancelled',
};

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loyalty, setLoyalty] = useState(null);
  const [adjustPoints, setAdjustPoints] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  const loadLoyalty = async () => {
    try {
      const res = await api.get(`/api/loyalty/admin/${id}`);
      setLoyalty(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/customers/${id}`);
        setCustomer(res.data.data.customer);
      } catch (error) {
        toast.error(handleAxiosError(error, 'Failed to load customer'));
        navigate('/customers');
      } finally {
        setLoading(false);
      }
    })();
    loadLoyalty();
  }, [id]);

  const submitAdjust = async (e) => {
    e.preventDefault();
    const points = Number(adjustPoints);
    if (!points) {
      toast.error('Enter a non-zero number of points');
      return;
    }
    setAdjusting(true);
    try {
      await api.post('/api/loyalty/admin/adjust', { userId: id, points, reason: adjustReason || undefined });
      toast.success('Points balance updated');
      setAdjustPoints('');
      setAdjustReason('');
      await loadLoyalty();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to adjust points'));
    } finally {
      setAdjusting(false);
    }
  };

  if (loading) return <p className="py-16 text-center text-gray-400">Loading…</p>;
  if (!customer) return null;

  return (
    <div className="flex flex-col gap-6">
      <button onClick={() => navigate('/customers')} className="text-sm text-gray-500 hover:text-ink self-start">← Back to customers</button>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6 flex items-center gap-5 flex-wrap">
        <div className="w-14 h-14 rounded-full bg-accent-100 text-accent-700 font-bold text-lg flex items-center justify-center">
          {customer.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-lg font-semibold">{customer.name}</p>
          <p className="text-sm text-gray-500">{customer.email}</p>
          <p className="text-xs text-gray-400 mt-1">Joined {new Date(customer.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-accent-600">{currency}{customer.totalSpend.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400">{customer.orders.length} order{customer.orders.length === 1 ? '' : 's'}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 grid grid-cols-4">
          <p>Order</p><p>Date</p><p>Status</p><p>Amount</p>
        </div>
        {customer.orders.length === 0 ? (
          <p className="py-8 text-center text-gray-400">No orders yet.</p>
        ) : customer.orders.map((o) => (
          <div key={o.id} className="grid grid-cols-4 px-4 py-3 border-t border-gray-50 text-sm items-center">
            <p className="text-xs">#{o.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</p>
            <p className="text-xs px-2 py-1 rounded-full bg-accent-50 text-accent-700 w-fit">{STATUS_LABELS[o.status] || o.status}</p>
            <p className="font-medium">{currency}{o.amount}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Loyalty Points</p>
          <p className="text-2xl font-bold text-accent-600">{loyalty?.balance ?? '—'}</p>
        </div>

        <form onSubmit={submitAdjust} className="flex flex-col sm:flex-row gap-2">
          <input
            type="number"
            value={adjustPoints}
            onChange={(e) => setAdjustPoints(e.target.value)}
            placeholder="±points (e.g. 50 or -20)"
            className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-xs w-44"
          />
          <input
            type="text"
            value={adjustReason}
            onChange={(e) => setAdjustReason(e.target.value)}
            placeholder="Reason (optional)"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-xs"
          />
          <button
            type="submit"
            disabled={adjusting}
            className="text-xs px-4 py-2 bg-ink text-white rounded-full hover:bg-accent-600 transition-colors duration-250 disabled:opacity-60 shrink-0"
          >
            {adjusting ? 'Applying…' : 'Apply'}
          </button>
        </form>

        {loyalty?.ledger?.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-50 max-h-56 overflow-y-auto">
            {loyalty.ledger.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between text-xs">
                <p className="text-gray-500">{entry.reason.replace(/_/g, ' ')} · {new Date(entry.createdAt).toLocaleDateString()}</p>
                <p className={entry.points >= 0 ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                  {entry.points >= 0 ? '+' : ''}{entry.points}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;
