import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { currency } from '../config';
import { api } from '../lib/apiClient';
import { handleAxiosError } from '../utils/handleAxiosError';

const emptyForm = {
  code: '', type: 'PERCENT', value: '', minOrderAmount: '', maxDiscount: '', usageLimit: '', expiresAt: '',
};

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/coupons/admin/list');
      setCoupons(res.data.data.coupons || []);
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to load coupons'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        code: form.code,
        type: form.type,
        value: Number(form.value),
        ...(form.minOrderAmount ? { minOrderAmount: Number(form.minOrderAmount) } : {}),
        ...(form.maxDiscount ? { maxDiscount: Number(form.maxDiscount) } : {}),
        ...(form.usageLimit ? { usageLimit: Number(form.usageLimit) } : {}),
        ...(form.expiresAt ? { expiresAt: new Date(form.expiresAt).toISOString() } : {}),
      };
      await api.post('/api/coupons/admin', payload);
      toast.success('Coupon created');
      setForm(emptyForm);
      fetchCoupons();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to create coupon'));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (coupon) => {
    try {
      await api.patch(`/api/coupons/admin/${coupon.id}`, { active: !coupon.active });
      fetchCoupons();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to update coupon'));
    }
  };

  const removeCoupon = async (coupon) => {
    try {
      await api.delete(`/api/coupons/admin/${coupon.id}`);
      toast.success('Coupon removed');
      fetchCoupons();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to remove coupon'));
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 max-w-2xl bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
        <p className="font-medium text-lg mb-1">Create Coupon</p>
        <div className="flex flex-wrap gap-3">
          <input name="code" value={form.code} onChange={onChange} placeholder="CODE20" required
            className="px-3 py-2.5 border border-gray-200 rounded-xl w-40 uppercase bg-gray-50 focus:bg-white focus:border-accent-500 outline-none transition-colors duration-250" />
          <select name="type" value={form.type} onChange={onChange} className="px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none transition-colors duration-250">
            <option value="PERCENT">Percent %</option>
            <option value="FLAT">Flat ₹</option>
          </select>
          <input name="value" value={form.value} onChange={onChange} type="number" min="0" step="0.01" required
            placeholder={form.type === 'PERCENT' ? 'e.g. 10' : 'e.g. 150'}
            className="px-3 py-2.5 border border-gray-200 rounded-xl w-32 bg-gray-50 focus:bg-white focus:border-accent-500 outline-none transition-colors duration-250" />
        </div>
        <div className="flex flex-wrap gap-3">
          <input name="minOrderAmount" value={form.minOrderAmount} onChange={onChange} type="number" min="0"
            placeholder="Min order amount" className="px-3 py-2.5 border border-gray-200 rounded-xl w-40 bg-gray-50 focus:bg-white focus:border-accent-500 outline-none transition-colors duration-250" />
          <input name="maxDiscount" value={form.maxDiscount} onChange={onChange} type="number" min="0"
            placeholder="Max discount cap" className="px-3 py-2.5 border border-gray-200 rounded-xl w-40 bg-gray-50 focus:bg-white focus:border-accent-500 outline-none transition-colors duration-250" />
          <input name="usageLimit" value={form.usageLimit} onChange={onChange} type="number" min="1"
            placeholder="Usage limit" className="px-3 py-2.5 border border-gray-200 rounded-xl w-32 bg-gray-50 focus:bg-white focus:border-accent-500 outline-none transition-colors duration-250" />
          <input name="expiresAt" value={form.expiresAt} onChange={onChange} type="date"
            className="px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none transition-colors duration-250" />
        </div>
        <button type="submit" disabled={submitting}
          className="self-start px-8 py-2.5 bg-ink text-white rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-60">
          {submitting ? 'Creating…' : 'Create Coupon'}
        </button>
      </form>

      <div>
        <p className="font-medium text-lg mb-3">All Coupons</p>
        {loading ? (
          <p className="text-gray-400">Loading…</p>
        ) : coupons.length === 0 ? (
          <p className="text-gray-400">No coupons yet.</p>
        ) : (
          <div className="overflow-x-auto bg-white border border-gray-100 rounded-2xl shadow-soft">
            <table className="w-full text-sm text-left overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Code</th>
                  <th className="px-4 py-2">Discount</th>
                  <th className="px-4 py-2">Min Order</th>
                  <th className="px-4 py-2">Used</th>
                  <th className="px-4 py-2">Expires</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-t border-gray-100">
                    <td className="px-4 py-2 font-medium">{c.code}</td>
                    <td className="px-4 py-2">{c.type === 'PERCENT' ? `${c.value}%` : `${currency}${c.value}`}</td>
                    <td className="px-4 py-2">{c.minOrderAmount > 0 ? `${currency}${c.minOrderAmount}` : '—'}</td>
                    <td className="px-4 py-2">{c.timesUsed}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
                    <td className="px-4 py-2">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => toggleActive(c)} className={`text-xs px-2.5 py-1 rounded-full ${c.active ? 'bg-accent-50 text-accent-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button onClick={() => removeCoupon(c)} className="text-xs text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupons;
