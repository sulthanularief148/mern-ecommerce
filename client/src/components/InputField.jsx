const InputField = ({ type = "text", placeholder, required, onChange, value, name }) => (
  <input
    className="w-full px-3 py-2 border border-gray-800"
    type={type}
    placeholder={placeholder}
    required={required}
    name={name}       // important
    onChange={onChange}
    value={value}
  />
);
export default InputField;
