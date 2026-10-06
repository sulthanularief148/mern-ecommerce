import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthShell, AuthInput } from "../components";
import { LockIcon } from "../components/authIcons";
import { handleAxiosError } from "../../utils/handleAxiosError";
import * as authApi from "../services/authApi";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("This reset link is missing its token — please request a new one.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setSubmitting(true);
    try {
      await authApi.resetPassword({ token, newPassword });
      toast.success("Password reset — please log in with your new password");
      navigate("/login");
    } catch (error) {
      toast.error(handleAxiosError(error, "This reset link is invalid or has expired"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Set a new password"
      subtitle={token ? "Make it something you'll remember." : undefined}
    >
      {!token && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 mb-4">
          This link is missing a reset token. Please request a new one from the{" "}
          <Link to="/forgot-password" className="underline">forgot password</Link> page.
        </p>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
        <AuthInput icon={<LockIcon />} label="New password" type="password" name="newPassword" required
          value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
        <AuthInput icon={<LockIcon />} label="Confirm new password" type="password" name="confirmPassword" required
          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
        <button
          type="submit"
          disabled={submitting || !token}
          className="mt-2 bg-ink text-white font-medium py-3 rounded-xl hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-60"
        >
          {submitting ? "Resetting…" : "Reset password"}
        </button>
        <Link to="/login" className="text-center text-sm text-gray-500 hover:text-ink transition-colors duration-250 mt-1">
          ← Back to sign in
        </Link>
      </form>
    </AuthShell>
  );
};

export default ResetPassword;
