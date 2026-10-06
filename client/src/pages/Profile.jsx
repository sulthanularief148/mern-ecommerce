import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { SectionWrapper } from "../hoc";
import { ShopContext } from "../context/ShopContext";
import { Title } from "../components";
import { handleAxiosError } from "../../utils/handleAxiosError";
import * as authApi from "../services/authApi";
import * as loyaltyApi from "../services/loyaltyApi";

const STAT_LABELS = [
  { key: "orders", label: "Orders", to: "/orders" },
  { key: "wishlist", label: "Wishlist Items", to: "/wishlist" },
  { key: "reviews", label: "Reviews Written", to: null },
];

const Profile = () => {
  const { user, setUser, authReady, navigate, logout } = useContext(ShopContext);
  const [stats, setStats] = useState(null);
  const [loyalty, setLoyalty] = useState(null);
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!authReady) return;
    if (!user) { navigate("/login"); return; }
    setName(user.name);
    authApi.fetchAccountStats().then(setStats).catch(() => setStats(null));
    loyaltyApi.fetchLoyaltySummary().then(setLoyalty).catch(() => setLoyalty(null));
  }, [authReady, user]);

  const referralLink = user.referralCode ? `${window.location.origin}/login?ref=${user.referralCode}` : "";
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => toast.success("Referral link copied"))
      .catch(() => toast.error("Failed to copy link"));
  };

  if (!authReady || !user) {
    return <div className="border-t pt-16 pb-20 text-center text-gray-400">Loading profile…</div>;
  }

  const initials = user.name?.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : null;

  const onSaveName = async (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim() === user.name) return;
    setSavingName(true);
    try {
      const updated = await authApi.updateProfile({ name: name.trim() });
      setUser(updated);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(handleAxiosError(error, "Failed to update profile"));
    } finally {
      setSavingName(false);
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    setChangingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      toast.success("Password changed — please log in again");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      await logout();
    } catch (error) {
      toast.error(handleAxiosError(error, "Failed to change password"));
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="border-t pt-14 pb-20 max-w-3xl mx-auto">
      <Title text1="MY" text2="PROFILE" />

      {/* Account overview */}
      <div className="mt-6 bg-white border border-gray-100 rounded-2xl shadow-soft p-6 flex items-center gap-5 flex-wrap">
        <div className="w-16 h-16 rounded-full bg-accent-100 text-accent-700 heading-display text-xl flex items-center justify-center shrink-0">
          {initials || "?"}
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-lg font-semibold text-ink">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          {memberSince && <p className="text-xs text-gray-400 mt-1">Member since {memberSince}</p>}
        </div>
        <button
          type="button"
          onClick={logout}
          className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:border-red-300 hover:text-red-500 transition-colors duration-250"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {STAT_LABELS.map((s) => {
            const content = (
              <div className="text-center bg-white border border-gray-100 rounded-2xl shadow-soft py-5 px-2 h-full">
                <p className="heading-display text-2xl text-accent-600">{stats[s.key] ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            );
            return s.to ? (
              <Link key={s.key} to={s.to} className="hover:shadow-card transition-shadow duration-250 rounded-2xl">
                {content}
              </Link>
            ) : (
              <div key={s.key}>{content}</div>
            );
          })}
        </div>
      )}

      {/* Loyalty & referrals */}
      <div className="mt-6 bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-semibold text-ink mb-1">Loyalty Points</p>
            <p className="text-xs text-gray-400">Earned on paid orders — redeem them for a discount at checkout.</p>
          </div>
          <p className="heading-display text-3xl text-accent-600">{loyalty?.balance ?? 0}</p>
        </div>

        <div className="mt-5 pt-5 border-t border-gray-100">
          <p className="font-semibold text-ink mb-1">Refer a Friend</p>
          <p className="text-xs text-gray-400 mb-3">Share your link — you both get bonus points when they place their first order.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              readOnly
              value={referralLink}
              onClick={(e) => e.target.select()}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 outline-none"
            />
            <button
              type="button"
              onClick={copyReferralLink}
              className="px-6 py-2.5 text-sm bg-ink text-white rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250"
            >
              Copy Link
            </button>
          </div>
        </div>

        {loyalty?.ledger?.length > 0 && (
          <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col gap-1.5 max-h-48 overflow-y-auto">
            {loyalty.ledger.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between text-xs">
                <p className="text-gray-500 capitalize">{entry.reason.replace(/_/g, ' ')} · {new Date(entry.createdAt).toLocaleDateString()}</p>
                <p className={entry.points >= 0 ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                  {entry.points >= 0 ? '+' : ''}{entry.points}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit name */}
      <form onSubmit={onSaveName} className="mt-6 bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
        <p className="font-semibold text-ink mb-1">Account Details</p>
        <p className="text-xs text-gray-400 mb-4">Update the name on your account.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full name"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 outline-none focus:border-accent-500 focus:bg-white focus:ring-4 focus:ring-accent-50 transition-colors duration-250"
          />
          <button
            type="submit"
            disabled={savingName || !name.trim() || name.trim() === user.name}
            className="px-6 py-2.5 text-sm bg-ink text-white rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {savingName ? "Saving…" : "Save"}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">Email address can't be changed — contact support if you need help with that.</p>
      </form>

      {/* Change password */}
      <form onSubmit={onChangePassword} className="mt-6 bg-white border border-gray-100 rounded-2xl shadow-soft p-6">
        <p className="font-semibold text-ink mb-1">Change Password</p>
        <p className="text-xs text-gray-400 mb-4">You'll be logged out of this session once it's changed.</p>
        <div className="flex flex-col gap-3 max-w-sm">
          <input
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            type="password"
            placeholder="Current password"
            required
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 outline-none focus:border-accent-500 focus:bg-white focus:ring-4 focus:ring-accent-50 transition-colors duration-250"
          />
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            placeholder="New password"
            required
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 outline-none focus:border-accent-500 focus:bg-white focus:ring-4 focus:ring-accent-50 transition-colors duration-250"
          />
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm new password"
            required
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 outline-none focus:border-accent-500 focus:bg-white focus:ring-4 focus:ring-accent-50 transition-colors duration-250"
          />
          <button
            type="submit"
            disabled={changingPassword}
            className="self-start px-6 py-2.5 text-sm bg-ink text-white rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-40"
          >
            {changingPassword ? "Updating…" : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SectionWrapper(Profile, "profile");
