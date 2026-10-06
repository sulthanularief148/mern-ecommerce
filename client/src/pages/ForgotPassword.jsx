import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthShell, AuthInput } from "../components";
import { MailIcon } from "../components/authIcons";
import { handleAxiosError } from "../../utils/handleAxiosError";
import * as authApi from "../services/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (error) {
      toast.error(handleAxiosError(error, "Something went wrong. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Forgot your password?"
      subtitle={sent ? undefined : "Enter the email on your account and we'll send you a reset link."}
    >
      {sent ? (
        <div className="flex flex-col gap-4">
          <div className="w-11 h-11 rounded-full bg-accent-50 text-accent-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">
            If an account exists for <strong className="text-ink">{email}</strong>, we&apos;ve sent a link to reset your password. It expires in 30 minutes.
          </p>
          <Link to="/login" className="text-sm text-accent-600 hover:text-accent-700 underline underline-offset-2 self-start">
            ← Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
          <AuthInput icon={<MailIcon />} label="Email" type="email" name="email" required
            value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-ink text-white font-medium py-3 rounded-xl hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send reset link"}
          </button>
          <Link to="/login" className="text-center text-sm text-gray-500 hover:text-ink transition-colors duration-250 mt-1">
            ← Back to sign in
          </Link>
        </form>
      )}
    </AuthShell>
  );
};

export default ForgotPassword;
