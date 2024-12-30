const InputField = ({ type, placeholder, required, onChange, value }) => (
    <input
      className="w-full px-3 py-2 border border-gray-800"
      type={type}
      placeholder={placeholder}
      required={required}
      onChange={onChange}
      value={value}
    />
  );
  
  export default InputField;
  