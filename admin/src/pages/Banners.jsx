import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../lib/apiClient';
import { handleAxiosError } from '../utils/handleAxiosError';

const SLOTS = [
  { value: 'HERO', label: 'Hero (Homepage top)' },
  { value: 'PROMO', label: 'Promo Banner' },
  { value: 'EDITORS_PICK', label: "Editor's Picks" },
];

const emptyForm = { slot: 'HERO', title: '', subtitle: '', imageUrl: '', linkUrl: '', ctaLabel: '', sortOrder: 0 };

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/banners/admin/list');
      setBanners(res.data.data.banners);
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to load banners'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !form.imageUrl) {
      toast.error('Upload an image or provide an image URL');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') formData.append(k, v); });
      if (imageFile) formData.append('image', imageFile);
      await api.post('/api/banners/admin', formData);
      toast.success('Banner created');
      setForm(emptyForm);
      setImageFile(null);
      fetchBanners();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to create banner'));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (banner) => {
    try {
      await api.patch(`/api/banners/admin/${banner.id}`, { active: !banner.active });
      fetchBanners();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to update banner'));
    }
  };

  const removeBanner = async (id) => {
    try {
      await api.delete(`/api/banners/admin/${id}`);
      toast.success('Banner removed');
      fetchBanners();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to remove banner'));
    }
  };

  const inputClass = 'px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-sm transition-colors duration-250';

  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg font-medium">Banners</p>

      <form onSubmit={onSubmit} className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6 flex flex-col gap-4 max-w-2xl">
        <p className="font-medium">Create Banner</p>
        <div className="flex flex-wrap gap-3">
          <select name="slot" value={form.slot} onChange={onChange} className={inputClass}>
            {SLOTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <input name="title" value={form.title} onChange={onChange} placeholder="Title" required className={`flex-1 min-w-[160px] ${inputClass}`} />
        </div>
        <input name="subtitle" value={form.subtitle} onChange={onChange} placeholder="Subtitle (optional)" className={inputClass} />
        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-sm text-gray-500">
            Upload image:{' '}
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-xs" />
          </label>
          <span className="text-xs text-gray-400">or</span>
          <input name="imageUrl" value={form.imageUrl} onChange={onChange} placeholder="Image URL" className={`flex-1 min-w-[200px] ${inputClass}`} />
        </div>
        <div className="flex flex-wrap gap-3">
          <input name="linkUrl" value={form.linkUrl} onChange={onChange} placeholder="Link (e.g. /shop?category=Men)" className={`flex-1 min-w-[200px] ${inputClass}`} />
          <input name="ctaLabel" value={form.ctaLabel} onChange={onChange} placeholder="Button label (e.g. Shop Now)" className={inputClass} />
          <input name="sortOrder" type="number" value={form.sortOrder} onChange={onChange} placeholder="Sort order" className={`w-28 ${inputClass}`} />
        </div>
        <button type="submit" disabled={submitting} className="self-start px-8 py-2.5 bg-ink text-white rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-60 text-sm">
          {submitting ? 'Creating…' : 'Create Banner'}
        </button>
      </form>

      {loading ? (
        <p className="py-8 text-center text-gray-400">Loading…</p>
      ) : banners.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-soft py-12 text-center text-gray-400">No banners yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="bg-white border border-gray-100 rounded-2xl shadow-soft overflow-hidden">
              <img src={b.imageUrl} alt={b.title} className="w-full h-32 object-cover" />
              <div className="p-4">
                <p className="text-xs text-gray-400">{SLOTS.find((s) => s.value === b.slot)?.label}</p>
                <p className="font-medium text-sm">{b.title}</p>
                {b.subtitle && <p className="text-xs text-gray-500 mt-0.5">{b.subtitle}</p>}
                <div className="flex items-center justify-between mt-3">
                  <button onClick={() => toggleActive(b)} className={`text-xs px-2.5 py-1 rounded-full ${b.active ? 'bg-accent-50 text-accent-700' : 'bg-gray-100 text-gray-500'}`}>
                    {b.active ? 'Active' : 'Inactive'}
                  </button>
                  <button onClick={() => removeBanner(b.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Banners;
