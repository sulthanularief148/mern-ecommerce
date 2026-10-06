import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../lib/apiClient';
import { handleAxiosError } from '../utils/handleAxiosError';

const emptyForm = { name: '', description: '', sortOrder: 0 };

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/collections/admin/list');
      setCollections(res.data.data.collections);
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to load collections'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCollections(); }, []);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') formData.append(k, v); });
      if (imageFile) formData.append('image', imageFile);
      await api.post('/api/collections/admin', formData);
      toast.success('Collection created');
      setForm(emptyForm);
      setImageFile(null);
      fetchCollections();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to create collection'));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (c) => {
    try {
      await api.patch(`/api/collections/admin/${c.id}`, { active: !c.active });
      fetchCollections();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to update collection'));
    }
  };

  const removeCollection = async (id) => {
    try {
      await api.delete(`/api/collections/admin/${id}`);
      toast.success('Collection removed');
      fetchCollections();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to remove collection'));
    }
  };

  const inputClass = 'px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-sm transition-colors duration-250';

  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg font-medium">Collections</p>
      <p className="text-xs text-gray-400 -mt-4">
        Named groupings (e.g. &quot;New Arrivals&quot;, &quot;Winter Essentials&quot;) — type a collection&apos;s name exactly into a product&apos;s Collection field to include it here.
      </p>

      <form onSubmit={onSubmit} className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6 flex flex-col gap-4 max-w-2xl">
        <p className="font-medium">Create Collection</p>
        <input name="name" value={form.name} onChange={onChange} placeholder="Name (e.g. New Arrivals)" required className={inputClass} />
        <input name="description" value={form.description} onChange={onChange} placeholder="Description (optional)" className={inputClass} />
        <label className="text-sm text-gray-500">
          Cover image (optional):{' '}
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-xs" />
        </label>
        <button type="submit" disabled={submitting} className="self-start px-8 py-2.5 bg-ink text-white rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-60 text-sm">
          {submitting ? 'Creating…' : 'Create Collection'}
        </button>
      </form>

      {loading ? (
        <p className="py-8 text-center text-gray-400">Loading…</p>
      ) : collections.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-soft py-12 text-center text-gray-400">No collections yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((c) => (
            <div key={c.id} className="bg-white border border-gray-100 rounded-2xl shadow-soft overflow-hidden">
              {c.imageUrl && <img src={c.imageUrl} alt={c.name} className="w-full h-28 object-cover" />}
              <div className="p-4">
                <p className="font-medium text-sm">{c.name}</p>
                {c.description && <p className="text-xs text-gray-500 mt-0.5">{c.description}</p>}
                <p className="text-xs text-gray-400 mt-1">{c.productCount} product{c.productCount === 1 ? '' : 's'}</p>
                <div className="flex items-center justify-between mt-3">
                  <button onClick={() => toggleActive(c)} className={`text-xs px-2.5 py-1 rounded-full ${c.active ? 'bg-accent-50 text-accent-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.active ? 'Active' : 'Inactive'}
                  </button>
                  <button onClick={() => removeCollection(c.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;
