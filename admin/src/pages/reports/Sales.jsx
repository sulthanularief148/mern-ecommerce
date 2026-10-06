import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { currency } from '../../config';
import { api } from '../../lib/apiClient';
import { handleAxiosError } from '../../utils/handleAxiosError';
import StatCard from '../../components/StatCard';
import MiniBarChart from '../../components/MiniBarChart';

const RANGE_OPTIONS = [7, 30, 90];

const Sales = () => {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/api/reports/sales', { params: { days } })
      .then((res) => setData(res.data.data))
      .catch((error) => toast.error(handleAxiosError(error, 'Failed to load sales report')))
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-lg font-medium">Sales Report</p>
        <div className="flex gap-2">
          {RANGE_OPTIONS.map((d) => (
            <button
              key={d} onClick={() => setDays(d)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors duration-250 ${days === d ? 'bg-ink text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {d} days
            </button>
          ))}
        </div>
      </div>

      {loading || !data ? (
        <p className="py-8 text-center text-gray-400">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Revenue" value={`${currency}${data.totalRevenue.toLocaleString('en-IN')}`} accent />
            <StatCard label="Total Orders" value={data.totalOrders} />
            <StatCard label="Discounts Given" value={`${currency}${data.totalDiscounts.toLocaleString('en-IN')}`} />
            <StatCard label="Tax + Shipping Collected" value={`${currency}${(data.totalTax + data.totalShipping).toLocaleString('en-IN')}`} />
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
            <p className="font-medium mb-4">Revenue by Day</p>
            {data.byDay.length === 0 ? (
              <p className="text-sm text-gray-400">No orders in this range.</p>
            ) : (
              <MiniBarChart data={data.byDay} labelKey="date" valueKey="revenue" formatValue={(v) => `${currency}${v}`} />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
              <p className="font-medium mb-4">By Payment Method</p>
              {data.byPaymentMethod.map((r) => (
                <div key={r.method} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                  <p>{r.method}</p>
                  <p className="font-medium">{currency}{r.revenue.toLocaleString('en-IN')} ({r.orders})</p>
                </div>
              ))}
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
              <p className="font-medium mb-4">By Delivery Method</p>
              {data.byDeliveryMethod.map((r) => (
                <div key={r.method} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                  <p>{r.method}</p>
                  <p className="font-medium">{currency}{r.revenue.toLocaleString('en-IN')} ({r.orders})</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sales;
