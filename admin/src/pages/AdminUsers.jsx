import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../lib/apiClient';
import { handleAxiosError } from '../utils/handleAxiosError';

const AdminUsers = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin-users');
      setAdmins(res.data.data.admins);
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to load admins'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const onPromote = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/api/admin-users/promote', { email: email.trim() });
      toast.success(`${email} is now an admin`);
      setEmail('');
      fetchAdmins();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to promote user'));
    } finally {
      setSubmitting(false);
    }
  };

  const onDemote = async (admin) => {
    try {
      await api.delete(`/api/admin-users/${admin.id}`);
      toast.success(`Removed admin access for ${admin.email}`);
      fetchAdmins();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to remove admin access'));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg font-medium">Admin Users</p>

      <form onSubmit={onPromote} className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6 flex flex-col gap-3 max-w-lg">
        <p className="font-medium">Grant Admin Access</p>
        <p className="text-xs text-gray-400">The person must already have a registered account on the storefront.</p>
        <div className="flex gap-2">
          <input
            value={email} onChange={(e) => setEmail(e.target.value)} type="email" required
            placeholder="customer@example.com"
            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-sm"
          />
          <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-ink text-white rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-60 text-sm">
            {submitting ? 'Granting…' : 'Grant Access'}
          </button>
        </div>
      </form>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 grid grid-cols-4">
          <p>Name</p><p>Email</p><p>Role</p><p>Since</p>
        </div>
        {loading ? (
          <p className="py-8 text-center text-gray-400">Loading…</p>
        ) : admins.map((a) => (
          <div key={a.id} className="grid grid-cols-4 items-center px-4 py-3 border-t border-gray-50 text-sm">
            <p>{a.name}</p>
            <p className="text-gray-500">{a.email}</p>
            <p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${a.role === 'SUPER_ADMIN' ? 'bg-accent-50 text-accent-600' : 'bg-gray-100 text-gray-500'}`}>
                {a.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
              </span>
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</p>
              {admins.length > 1 ? (
                <button onClick={() => onDemote(a)} className="text-xs text-red-500 hover:underline">Remove</button>
              ) : (
                <p className="text-xs text-gray-300" title="At least one admin must remain">Remove</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
