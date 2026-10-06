import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { currency } from '../../config';
import { api } from '../../lib/apiClient';
import { handleAxiosError } from '../../utils/handleAxiosError';
import StatCard from '../../components/StatCard';

const ProductsReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/reports/products')
      .then((res) => setData(res.data.data))
      .catch((error) => toast.error(handleAxiosError(error, 'Failed to load products report')))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <p className="py-8 text-center text-gray-400">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg font-medium">Products Report</p>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Total Products" value={data.totalProducts} />
        <StatCard label="Products With No Sales" value={data.productsWithNoSales} />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
        <p className="font-medium mb-4">Top Selling Products</p>
        {data.topSelling.length === 0 ? (
          <p className="text-sm text-gray-400">No sales yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.topSelling.map((r, i) => (
              <div key={r.product.id} className="flex items-center gap-3 text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <p className="text-gray-300 font-medium w-5">{i + 1}</p>
                <img src={r.product.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{r.product.name}</p>
                  <p className="text-xs text-gray-400">{r.quantitySold} units sold</p>
                </div>
                <p className="font-medium text-accent-600">{currency}{r.revenue.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
        <p className="font-medium mb-4">By Category</p>
        {data.byCategory.map((r) => (
          <div key={r.category} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
            <p>{r.category}</p>
            <p className="text-gray-500">{r.productCount} products · {r.totalStock} units in stock</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsReport;
