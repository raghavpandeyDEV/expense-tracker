// RegisterPage.js
import { useEffect, useState } from "react";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { registerAPI } from "../../utils/ApiRequest";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = values;

    setLoading(true);

    try {
      const { data } = await axios.post(registerAPI, {
        name,
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message, toastOptions);
        navigate("/");
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      toast.error("Registration failed", toastOptions);
    }

    setLoading(false);
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">

      {/* Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <AccountBalanceWalletIcon sx={{ fontSize: 50, color: "#0f172a" }} />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">
          Create Expense Tracker Account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={values.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-700 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={values.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-700 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={values.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-700 outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-700 transition"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-slate-900 font-medium hover:underline"
            >
              Login
            </Link>
          </p>

        </form>

      </div>

      <ToastContainer />

    </div>
  );
};

export default Register;