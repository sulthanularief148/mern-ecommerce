import { useContext, useEffect, useState } from "react";
import { loginContent } from "../constant";
import { SectionWrapper } from "../hoc";
import { InputField, ToggleText } from "../components";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currenState, setCurrentState] = useState("Login");
  const { token, setToken, backendurl, navigate } = useContext(ShopContext)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')



  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currenState === "Sign Up") {
        console.log(currenState);

        // Sign Up
        const response = await axios.post(`${backendurl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem("token", response.data.token)
        } else {
          toast.error(response.data.message)
          console.log(response.data.message);

        }

      } else {
        // Login
        const response = await axios.post(`${backendurl}/api/user/login`, { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
          console.log(response.data.message);
        }

      }

    } catch (error) {
      console.log(error.message);
      toast.error(error.message)

    }
  };
  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);
  
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currenState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currenState === "Login" ? null : (
        <InputField
          type="text"
          placeholder={loginContent.placeholders.name}
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      )}

      <InputField
        type="email"
        placeholder={loginContent.placeholders.email}
        required
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <InputField
        type="password"
        placeholder={loginContent.placeholders.password}
        required
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <ToggleText
        currenState={currenState}
        setCurrentState={setCurrentState}
        loginContent={loginContent}
      />

      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currenState === "Login"
          ? loginContent.buttonText.login
          : loginContent.buttonText.signUp}
      </button>
    </form>
  );
};

export default SectionWrapper(Login, "login");
