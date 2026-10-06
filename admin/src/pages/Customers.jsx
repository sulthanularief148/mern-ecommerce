import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { currency } from '../config';
import { api } from '../lib/apiClient';
import { handleAxiosError } from '../utils/handleAxiosError';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async (q) => {
    setLoading(true);
    try {
      const res = await api.get('/api/customers', { params: { limit: 50, search: q || undefined } });
      setCustomers(res.data.data.customers);
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to load customers'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const onSearch = (e) => { e.preventDefault(); fetchCustomers(search); };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-lg font-medium">Customers</p>
        <form onSubmit={onSearch}>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-sm transition-colors duration-250"
          />
        </form>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500">
          <p>Customer</p><p>Joined</p><p>Orders</p><p>Total Spend</p><p></p>
        </div>
        {loading ? (
          <p className="py-8 text-center text-gray-400">Loading…</p>
        ) : customers.length === 0 ? (
          <p className="py-8 text-center text-gray-400">No customers found.</p>
        ) : customers.map((c) => (
          <div key={c.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_0.5fr] items-center gap-1 px-4 py-3 border-t border-gray-50 text-sm">
            <div>
              <p>{c.name}</p>
              <p className="text-xs text-gray-400">{c.email}</p>
            </div>
            <p className="text-gray-500 text-xs md:text-sm">{new Date(c.createdAt).toLocaleDateString()}</p>
            <p>{c.orderCount}</p>
            <p className="font-medium">{currency}{c.totalSpend.toLocaleString('en-IN')}</p>
            <Link to={`/customers/${c.id}`} className="text-xs text-accent-600 hover:underline">View</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;
