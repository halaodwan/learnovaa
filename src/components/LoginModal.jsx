import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    console.log({ firstName, lastName, email, password });

    if (onClose) onClose();
    if (typeof onLoginSuccess === "function") onLoginSuccess();
    if (onLoginSuccess) onLoginSuccess();
    if (onClose) onClose();

    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6"
      >
        {/* Header */}
        <div className="flex justify-center mb-4">
          <div className="bg-slate-800 text-white p-4 rounded-2xl text-xl">
            🎓
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold text-slate-800">
          Welcome to Learnova
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Sign in to continue learning
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* First Name */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 h-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
              autoComplete="off"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 h-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
              autoComplete="off"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 h-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
              autoComplete="off"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 h-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-900 transition"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="flex justify-between mt-4 text-sm text-gray-500">
          <span className="hover:underline cursor-pointer">
            Forgot Password?
          </span>
          <span className="hover:underline cursor-pointer">
            Create Account
          </span>
        </div>
      </motion.div>
    </div>
  );
}
