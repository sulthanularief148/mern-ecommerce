import { Link } from "react-router-dom";

const ToggleText = ({ currentState, setCurrentState, loginContent }) => (
  <div className="w-full flex justify-between text-sm mt-[-8px]">
    {currentState === "Login" ? (
      <Link to="/forgot-password" className="cursor-pointer hover:text-accent-600 transition-colors duration-250">
        {loginContent.forgotPassword}
      </Link>
    ) : <span />}
    {currentState === "Login" ? (
      <p onClick={() => setCurrentState("Sign Up")} className="cursor-pointer">
        {loginContent.createAccount}
      </p>
    ) : (
      <p
        className="cursor-pointer"
        onClick={() => setCurrentState("Login")}
      >
        {loginContent.login}
      </p>
    )}
  </div>
);

export default ToggleText;
