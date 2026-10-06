import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { currency } from '../../config';
import { api } from '../../lib/apiClient';
import { handleAxiosError } from '../../utils/handleAxiosError';
import StatCard from '../../components/StatCard';

const InventoryReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/reports/inventory')
      .then((res) => setData(res.data.data))
      .catch((error) => toast.error(handleAxiosError(error, 'Failed to load inventory report')))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <p className="py-8 text-center text-gray-400">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg font-medium">Inventory Report</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Stock Value" value={`${currency}${data.totalStockValue.toLocaleString('en-IN')}`} accent />
        <StatCard label="Total Units" value={data.totalUnits.toLocaleString('en-IN')} />
        <StatCard label="Low Stock" value={data.lowStockCount} />
        <StatCard label="Out of Stock" value={data.outOfStockCount} />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
        <p className="font-medium mb-4">Stock by Category</p>
        {data.byCategory.map((r) => (
          <div key={r.category} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
            <p>{r.category}</p>
            <p className="text-gray-500">{r.productCount} products · {r.units} units</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryReport;
