import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { currency } from '../config';
import { api } from '../lib/apiClient';
import { handleAxiosError } from '../utils/handleAxiosError';

const STATUS_STYLES = {
  REQUESTED: 'bg-amber-50 text-amber-600',
  APPROVED: 'bg-blue-50 text-blue-600',
  REJECTED: 'bg-red-50 text-red-500',
  COMPLETED: 'bg-green-50 text-green-600',
};

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});
  const [saving, setSaving] = useState(null);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/returns/admin/list');
      setReturns(res.data.data.returnRequests || []);
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to load return requests'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReturns(); }, []);

  const updateStatus = async (id, status) => {
    setSaving(id);
    try {
      await api.patch(`/api/returns/admin/${id}`, { status, adminNote: notes[id] });
      toast.success(`Return request ${status.toLowerCase()}`);
      fetchReturns();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to update return request'));
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="py-16 text-center text-gray-400">Loading return requests…</div>;
  if (!returns.length) return <div className="py-16 text-center text-gray-400">No return requests yet.</div>;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-medium">Return Requests</p>
      {returns.map((r) => (
        <div key={r.id} className="border border-gray-100 p-5 rounded-2xl shadow-soft bg-white flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Order #{r.orderId.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-gray-400">{r.user?.name} · {r.user?.email}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_STYLES[r.status] || 'bg-gray-100 text-gray-500'}`}>
              {r.status}
            </span>
          </div>
          <p className="text-sm text-gray-600">{r.reason}</p>
          <p className="text-xs text-gray-400">Order total: {currency}{r.order?.amount} · Requested {new Date(r.createdAt).toLocaleDateString()}</p>

          {r.status === 'REQUESTED' && (
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-50">
              <input
                type="text"
                value={notes[r.id] || ''}
                onChange={(e) => setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))}
                placeholder="Note to customer (optional)"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-xs"
              />
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => updateStatus(r.id, 'APPROVED')}
                  disabled={saving === r.id}
                  className="text-xs px-4 py-2 bg-ink text-white rounded-full hover:bg-accent-600 transition-colors duration-250 disabled:opacity-60"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(r.id, 'REJECTED')}
                  disabled={saving === r.id}
                  className="text-xs px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors duration-250 disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          {r.status === 'APPROVED' && (
            <div className="flex gap-2 pt-2 border-t border-gray-50">
              <button
                type="button"
                onClick={() => updateStatus(r.id, 'COMPLETED')}
                disabled={saving === r.id}
                className="text-xs px-4 py-2 bg-ink text-white rounded-full hover:bg-accent-600 transition-colors duration-250 disabled:opacity-60"
              >
                Mark Completed
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Returns;
