import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { currency } from '../../config';
import { api } from '../../lib/apiClient';
import { handleAxiosError } from '../../utils/handleAxiosError';
import StatCard from '../../components/StatCard';
import MiniBarChart from '../../components/MiniBarChart';

const CustomersReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/reports/customers', { params: { days: 30 } })
      .then((res) => setData(res.data.data))
      .catch((error) => toast.error(handleAxiosError(error, 'Failed to load customers report')))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <p className="py-8 text-center text-gray-400">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg font-medium">Customers Report</p>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Total Customers" value={data.totalCustomers} />
        <StatCard label="Repeat Customers" value={data.repeatCustomers} sublabel="Placed more than 1 order" />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
        <p className="font-medium mb-4">New Customers — Last 30 Days</p>
        {data.newCustomersByDay.length === 0 ? (
          <p className="text-sm text-gray-400">No new signups in this range.</p>
        ) : (
          <MiniBarChart data={data.newCustomersByDay} labelKey="date" valueKey="count" />
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
        <p className="font-medium mb-4">Top Spenders</p>
        {data.topSpenders.length === 0 ? (
          <p className="text-sm text-gray-400">No orders yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.topSpenders.map((r, i) => (
              <div key={r.customer.id} className="flex items-center justify-between text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <p className="text-gray-300 font-medium w-5">{i + 1}</p>
                  <div>
                    <p>{r.customer.name}</p>
                    <p className="text-xs text-gray-400">{r.customer.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-accent-600">{currency}{r.totalSpend.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-400">{r.orderCount} orders</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersReport;
