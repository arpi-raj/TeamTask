import reg_image from "../assets/reg_image.jpeg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import {toast} from "react-toastify";

export default function Register() {
  const [registrationDetails, setRegistrationDetails] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const navigate=useNavigate();

  const {storetokenInLS}=useAuth();

  const handleInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log("reg " + name, value);
    setRegistrationDetails({ ...registrationDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Registration : " + JSON.stringify(registrationDetails));
    try {
      const reg_response = await fetch(
        `http://localhost:5000/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationDetails),
        }
      );

       const res_data=await reg_response.json();
        console.log(res_data);           

      if(reg_response.ok){


           storetokenInLS(res_data.token);         

        setRegistrationDetails({
          username: "",
          email: "",
          phone: "",
          password: "",
        });
        toast.success("Registration is done perfectly");
        navigate("/");
      }
      else{
        toast.error(res_data.extraDetails?res_data.extraDetails:res_data.msg);
      }
      console.log("Reg Response MERN : " + reg_response);
    } catch (error) {
      console.log("Reg ERROR : " + error);
    }
  };

  return (
    <section>
      <main className="flex flex-row justify-center gap-28 mt-12">
        <div>
          <img
            src={reg_image}
            alt="REG IMAGE"
            width="508"
            height="762"
            className="rounded-lg"
          />
        </div>
        <div className="w-[508px] flex flex-col gap-8 pt-10">
          <h1 className="text-5xl font-bold text-white mb-4">
            Registration Form
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 glass-card p-8">
            <div className="flex flex-col gap-2">
              <label className="text-gray-300">Username</label>
              <input
                type="text"
                required
                autoComplete="off"
                value={registrationDetails.username}
                onChange={handleInput}
                name="username"
                id="username"
                placeholder="Enter Username"
                className="glass-input"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-300">Email</label>
              <input
                type="email"
                required
                autoComplete="off"
                value={registrationDetails.email}
                onChange={handleInput}
                name="email"
                id="email"
                placeholder="Enter Email"
                className="glass-input"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-300">Phone</label>
              <input
                type="number"
                required
                autoComplete="off"
                value={registrationDetails.phone}
                onChange={handleInput}
                name="phone"
                id="phone"
                placeholder="Enter Phone Number"
                className="glass-input"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-300">Password</label>
              <input
                type="password"
                required
                autoComplete="off"
                value={registrationDetails.password}
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
              Sign Up
            </button>
            <div className="text-center mt-4">
              <span className="text-gray-400">Already have an account? </span>
              <a href="/login" className="text-primary hover:underline">Login here</a>
            </div>
          </form>
        </div>
      </main>
    </section>
  );
}
