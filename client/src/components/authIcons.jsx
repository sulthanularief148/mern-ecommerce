// Shared icon set for the auth pages (Login/ForgotPassword/ResetPassword) —
// previously each page defined its own copy of these.
export const UserIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="3.5" />
    <path strokeLinecap="round" d="M4.5 20c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7" />
  </svg>
);

export const MailIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7l8 6 8-6" />
  </svg>
);

export const LockIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
    <path strokeLinecap="round" d="M7.5 10.5V7.5a4.5 4.5 0 019 0v3" />
  </svg>
);
