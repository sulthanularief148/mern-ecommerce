import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthShell, AuthInput } from "../components";
import { UserIcon, MailIcon, LockIcon } from "../components/authIcons";
import { ShopContext } from "../context/ShopContext";
import { handleAxiosError } from "../../utils/handleAxiosError";
import * as authApi from "../services/authApi";
import { toast } from "react-toastify";

const Login = () => {
  const { user, setUser, navigate } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [currentState, setCurrentState] = useState(searchParams.get("ref") ? "Sign Up" : "Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode] = useState(searchParams.get("ref") || "");
  const [loading, setLoading] = useState(false);

  const isSignUp = currentState === "Sign Up";

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const registeredUser = await authApi.register({ name, email, password, referralCode });
        setUser(registeredUser);
        toast.success(referralCode ? "Registered successfully! Referral bonus applied." : "Registered successfully!");
      } else {
        const loggedInUser = await authApi.login({ email, password });
        setUser(loggedInUser);
        toast.success("Logged in successfully!");
      }
    } catch (error) {
      toast.error(handleAxiosError(error, "Something went wrong!"));
      console.error("Auth Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <AuthShell
      eyebrow={isSignUp ? "Join us" : "Welcome back"}
      title={isSignUp ? "Create your account" : "Sign in"}
      subtitle={isSignUp ? "A few details and you're in." : "Pick up right where you left off."}
    >
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-3.5">
        {referralCode && isSignUp && (
          <p className="text-xs text-accent-700 bg-accent-50 border border-accent-100 px-3 py-2.5 rounded-xl">
            You&apos;ve been referred — sign up to get a bonus of loyalty points!
          </p>
        )}

        {isSignUp && (
          <AuthInput icon={<UserIcon />} label="Full name" name="name" required
            value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        )}
        <AuthInput icon={<MailIcon />} label="Email" type="email" name="email" required
          value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        <AuthInput icon={<LockIcon />} label="Password" type="password" name="password" required
          value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isSignUp ? "new-password" : "current-password"} />

        {!isSignUp && (
          <Link to="/forgot-password" className="self-end text-xs text-gray-400 hover:text-accent-600 transition-colors duration-250 -mt-1">
            Forgot your password?
          </Link>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-ink text-white font-medium py-3 rounded-xl hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-60"
        >
          {loading ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-2">
          {isSignUp ? "Already have an account?" : "New to Webfarm's Wear?"}{" "}
          <button
            type="button"
            onClick={() => setCurrentState(isSignUp ? "Login" : "Sign Up")}
            className="text-ink font-medium hover:text-accent-600 transition-colors duration-250"
          >
            {isSignUp ? "Sign in" : "Create an account"}
          </button>
        </p>
      </form>
    </AuthShell>
  );
};

export default Login;
