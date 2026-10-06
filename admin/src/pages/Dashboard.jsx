import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { currency } from '../config';
import { api } from '../lib/apiClient';
import { handleAxiosError } from '../utils/handleAxiosError';
import StatCard from '../components/StatCard';
import MiniBarChart from '../components/MiniBarChart';

const STATUS_LABELS = {
  ORDER_PLACED: 'Order Placed', PACKING: 'Packing', SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery', DELIVERED: 'Delivered', CANCELLED: 'Cancelled',
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/dashboard/summary');
        setData(res.data.data);
      } catch (error) {
        toast.error(handleAxiosError(error, 'Failed to load dashboard'));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="py-16 text-center text-gray-400">Loading dashboard…</p>;
  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg font-medium">Dashboard</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`${currency}${data.totalRevenue.toLocaleString('en-IN')}`} accent />
        <StatCard label="Total Orders" value={data.totalOrders} sublabel={`${data.pendingOrders} in progress`} />
        <StatCard label="Customers" value={data.totalCustomers} />
        <StatCard label="Low Stock Items" value={data.lowStockCount} sublabel={data.lowStockCount > 0 ? 'Needs attention' : 'All good'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
          <p className="font-medium mb-4">Revenue — Last 7 Days</p>
          <MiniBarChart
            data={data.revenueLast7Days}
            labelKey="date"
            valueKey="revenue"
            formatValue={(v) => `${currency}${v}`}
          />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
          <p className="font-medium mb-4">Top Products</p>
          <div className="flex flex-col gap-3">
            {data.topProducts.length === 0 ? (
              <p className="text-sm text-gray-400">No sales yet.</p>
            ) : data.topProducts.map((tp) => (
              <div key={tp.product.id} className="flex items-center gap-3">
                <img src={tp.product.images?.[0]} alt="" className="w-9 h-9 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{tp.product.name}</p>
                  <p className="text-xs text-gray-400">{tp.quantitySold} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="font-medium">Recent Orders</p>
          <Link to="/orders" className="text-xs text-accent-600 hover:underline">View all</Link>
        </div>
        <div className="flex flex-col gap-2">
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400">No orders yet.</p>
          ) : data.recentOrders.map((o) => (
            <div key={o.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="font-medium">{o.customerName || o.customerEmail}</p>
                <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="text-xs px-2.5 py-1 rounded-full bg-accent-50 text-accent-700">{STATUS_LABELS[o.status] || o.status}</p>
              <p className="font-medium">{currency}{o.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
