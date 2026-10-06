const InputField = ({ type = "text", placeholder, required, onChange, value, name, error }) => (
  <div className="w-full">
    <input
      className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-colors duration-250 bg-gray-50 focus:bg-white focus:border-accent-500 focus:ring-4 focus:ring-accent-50 ${error ? "border-red-400" : "border-gray-200"}`}
      type={type}
      placeholder={placeholder}
      required={required}
      name={name}       // important
      onChange={onChange}
      value={value}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);
export default InputField;
