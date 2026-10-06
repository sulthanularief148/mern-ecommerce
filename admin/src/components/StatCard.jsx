const StatCard = ({ label, value, sublabel, accent = false }) => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-soft p-5">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${accent ? 'text-accent-600' : 'text-ink'}`}>{value}</p>
    {sublabel && <p className="text-xs text-gray-400 mt-1">{sublabel}</p>}
  </div>
);

export default StatCard;
