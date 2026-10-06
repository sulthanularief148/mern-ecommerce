import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../lib/apiClient';
import { handleAxiosError } from '../utils/handleAxiosError';

const FIELDS = [
  { name: 'storeName', label: 'Store Name', type: 'text' },
  { name: 'supportEmail', label: 'Support Email', type: 'email' },
  { name: 'supportPhone', label: 'Support Phone', type: 'text' },
  { name: 'address', label: 'Store Address', type: 'text' },
  { name: 'currencySymbol', label: 'Currency Symbol', type: 'text' },
  { name: 'taxRatePercent', label: 'Tax Rate (%)', type: 'number' },
  { name: 'standardShippingFee', label: 'Standard Shipping Fee', type: 'number' },
  { name: 'expressShippingFee', label: 'Express Shipping Fee', type: 'number' },
  { name: 'freeShippingThreshold', label: 'Free Shipping Threshold', type: 'number' },
  { name: 'socialInstagram', label: 'Instagram URL', type: 'text' },
  { name: 'socialFacebook', label: 'Facebook URL', type: 'text' },
];

const LOYALTY_FIELDS = [
  { name: 'pointsPerCurrencyUnit', label: 'Points Earned per ₹1 Spent', type: 'number', step: '0.01' },
  { name: 'pointValueInCurrency', label: 'Value of 1 Point (₹)', type: 'number', step: '0.01' },
  { name: 'referralSignupBonusPoints', label: 'Signup Bonus (points, for using a referral code)', type: 'number' },
  { name: 'referralBonusPoints', label: "Referrer's Bonus (points, on referred user's first order)", type: 'number' },
];

const Settings = () => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/api/settings')
      .then((res) => setForm(res.data.data.settings))
      .catch((error) => toast.error(handleAxiosError(error, 'Failed to load settings')))
      .finally(() => setLoading(false));
  }, []);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch('/api/settings', form);
      setForm(res.data.data.settings);
      toast.success('Settings saved');
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to save settings'));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <p className="py-8 text-center text-gray-400">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg font-medium">Settings</p>
      <p className="text-xs text-gray-400 -mt-4">
        Store details shown to customers. Tax rate, shipping fees, and free-shipping threshold here are live — checkout uses these values directly.
      </p>

      <form onSubmit={onSubmit} className="bg-white border border-gray-100 rounded-2xl shadow-soft p-6 max-w-2xl flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FIELDS.map((f) => (
            <div key={f.name}>
              <p className="text-sm mb-2">{f.label}</p>
              <input
                name={f.name} type={f.type} value={form[f.name] ?? ''} onChange={onChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-sm transition-colors duration-250"
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm font-medium mb-3">Loyalty &amp; Referrals</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LOYALTY_FIELDS.map((f) => (
              <div key={f.name}>
                <p className="text-sm mb-2">{f.label}</p>
                <input
                  name={f.name} type={f.type} step={f.step} value={form[f.name] ?? ''} onChange={onChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-sm transition-colors duration-250"
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="self-start px-8 py-2.5 bg-ink text-white rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-60 text-sm">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default Settings;
