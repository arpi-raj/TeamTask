import login_image from "../assets/login_image.jpeg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import {toast} from "react-toastify";

export default function Login() {
  const [loginDetails, setLoginDetails] = useState({
    email: "",

    password: "",
  });

  const navigate=useNavigate();

  const {storetokenInLS}=useAuth();


  const handleInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log("login " + name, value);
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("Login : " + JSON.stringify(loginDetails));
    try {
      const login_response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginDetails),
        }
      );

      if (login_response.ok) {
        const login_data=await login_response.json();
        console.log(login_data);                          

           storetokenInLS(login_data.token);     
        setLoginDetails({
          email: "",

          password: "",
        });
        toast.success("Login is done perfectly");
        navigate("/");
      }
      console.log("Login Response MERN : " + login_response);
    } catch (error) {
      console.log("Login ERROR : " + error);
    }
  };

  return (
    <section>
      <main className="flex flex-row justify-center gap-28 mt-12">
        <div>
          <img
            src={login_image}
            alt="REG IMAGE"
            width="508"
            height="762"
            className="rounded-lg"
          />
        </div>
        <div className="w-[508px] flex flex-col gap-8 pt-20">
          <h1 className="text-5xl font-bold text-white mb-4">
            Login Form
          </h1>
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 glass-card p-8">
            <div className="flex flex-col gap-2">
              <label className="text-gray-300">Email</label>
              <input
                type="email"
                required
                autoComplete="off"
                value={loginDetails.email}
                onChange={handleInput}
                name="email"
                id="email"
                placeholder="Enter Email"
                className="glass-input"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-300">Password</label>
              <input
                type="password"
                required
                autoComplete="off"
                value={loginDetails.password}
                onChange={handleInput}
                name="password"
                id="password"
                placeholder="Enter Password"
                className="glass-input"
              />
            </div>
            <button
              type="submit"
              className="glass-button w-full mt-4"
            >
              Login
            </button>
            <div className="text-center mt-4">
              <span className="text-gray-400">Don't have an account? </span>
              <a href="/register" className="text-primary hover:underline">Register here</a>
            </div>
          </form>
        </div>
      </main>
    </section>
  );
}
