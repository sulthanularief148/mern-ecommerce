import { Link } from "react-router-dom";
import Logo from "./Logo";

const VALUE_PROPS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4-9 4-9-4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10l9 4 9-4V7" />
      </svg>
    ),
    title: "Free shipping over ₹999",
    body: "Standard delivery, no minimum surprises at checkout.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.9 6.3 6.6.7-5 4.6 1.4 6.6L12 16.9 6.1 20.2 7.5 13.6l-5-4.6 6.6-.7z" />
      </svg>
    ),
    title: "Earn points on every order",
    body: "Redeem loyalty points for a discount anytime, or refer a friend for a bonus.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h11a5 5 0 010 10H9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 6l-4 4 4 4" />
      </svg>
    ),
    title: "7-day easy returns",
    body: "Changed your mind? Request a return right from your order history.",
  },
];

// Split-screen shell shared by Login/ForgotPassword/ResetPassword — a full
// immersive canvas (Layout skips header/footer/gutter for these routes) so
// the brand panel can bleed to the viewport edge instead of sitting inside
// the site's usual content column.
const AuthShell = ({ eyebrow, title, subtitle, children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-paper">
      <div className="relative hidden lg:flex lg:w-[44%] xl:w-[40%] flex-col justify-between overflow-hidden bg-gradient-to-br from-navy-600 via-navy-700 to-navy-900 px-12 py-12 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-accent-400/10 blur-3xl" />

        <Link to="/" className="relative z-10">
          <Logo size="lg" variant="light" />
        </Link>

        <div className="relative z-10 max-w-sm">
          <p className="uppercase tracking-[0.3em] text-accent-400 text-xs font-semibold mb-4">Webfarm&apos;s Wear</p>
          <h1 className="heading-display text-4xl xl:text-[2.75rem] leading-[1.1] mb-4">
            Sustainably made.<br />Thoughtfully worn.
          </h1>
          <p className="text-navy-100/80 text-sm leading-relaxed">
            Sign in to track orders, manage your wishlist, and pick up your cart right where you left it.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-5">
          {VALUE_PROPS.map((item) => (
            <div key={item.title} className="flex items-start gap-3.5">
              <div className="shrink-0 w-9 h-9 rounded-full border border-accent-400/40 bg-white/5 flex items-center justify-center text-accent-400">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-navy-100/60 mt-0.5">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 sm:px-10 lg:hidden">
          <Link to="/"><Logo size="md" /></Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-12 lg:p-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 hidden lg:block">
              <Link to="/" className="text-xs text-gray-400 hover:text-accent-600 transition-colors duration-250">← Back to store</Link>
            </div>
            {eyebrow && <p className="text-xs uppercase tracking-[0.25em] text-accent-600 font-semibold mb-2">{eyebrow}</p>}
            <h2 className="heading-display text-3xl text-ink mb-2">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 mb-8">{subtitle}</p>}
            {!subtitle && <div className="mb-6" />}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
