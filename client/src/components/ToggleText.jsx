const ToggleText = ({ currenState, setCurrentState, loginContent }) => (
    <div className="w-full flex justify-between text-sm mt-[-8px]">
      <p className="cursor-pointer">{loginContent.forgotPassword}</p>
      {currenState === "Login" ? (
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
  