import { useState } from "react";

const EyeIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
    {open ? (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.6 5.1A10.9 10.9 0 0112 5c7 0 10.5 7 10.5 7a13.7 13.7 0 01-3.1 3.9M6.6 6.6C3.4 8.6 1.5 12 1.5 12s3.5 7 10.5 7a10.6 10.6 0 004.4-.9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.9 9.9a3 3 0 004.2 4.2" />
      </>
    )}
  </svg>
);

// Icon + floating label + optional show/hide password toggle. A parallel
// component to InputField (used elsewhere, e.g. checkout) rather than
// changing it — this one is deliberately richer and only meant for the
// redesigned auth pages.
const AuthInput = ({ icon, label, type = "text", value, onChange, name, required, autoComplete, error }) => {
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (reveal ? "text" : "password") : type;

  return (
    <div className="w-full">
      <div className={`relative flex items-center border rounded-xl bg-gray-50 focus-within:bg-white focus-within:border-accent-500 focus-within:ring-4 focus-within:ring-accent-50 transition-colors duration-250 ${error ? "border-red-400" : "border-gray-200"}`}>
        <span className="pl-3.5 text-gray-400">{icon}</span>
        <div className="flex-1 px-3 pt-4 pb-1.5 min-w-0">
          <label className="block text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">{label}</label>
          <input
            className="w-full bg-transparent outline-none text-sm text-ink"
            type={inputType}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            autoComplete={autoComplete}
          />
        </div>
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            className="pr-3.5 text-gray-400 hover:text-ink transition-colors duration-250"
            tabIndex={-1}
            aria-label={reveal ? "Hide password" : "Show password"}
          >
            <EyeIcon open={reveal} />
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default AuthInput;
