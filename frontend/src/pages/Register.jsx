import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/register", form);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black text-white px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20">
        
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">
          Create Account
        </h1>

        {error && (
          <p className="text-red-400 text-center mb-4">{error}</p>
        )}

        <form onSubmit={submit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            onChange={handleChange}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-blue-400"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-blue-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-blue-400"
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Your Country (EX: IN, US, UK)"
            onChange={handleChange}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-blue-400"
          />

          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-gray-300">
          Already have an account?
          <Link to="/login" className="text-blue-400 ml-1 underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
