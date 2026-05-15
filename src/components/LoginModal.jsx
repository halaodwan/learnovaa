import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginModal({ onClose, onLoginSuccess }) {

  const [isRegister, setIsRegister] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  /* =========================
     LOGIN
  ========================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3001/users/login",
        { email, password }
      );

      // token
      localStorage.setItem("token", res.data.token);

      // user (اختياري)
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login success");

      onClose?.();
      onLoginSuccess?.();

      navigate("/");

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  /* =========================
     REGISTER
  ========================= */
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3001/users",
        {
          firstName,
          lastName,
          email,
          password
        }
      );

      alert("Account created successfully");

      
      setIsRegister(false);

      
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6"
      >

        <h2 className="text-center text-2xl font-bold text-slate-800">
          {isRegister ? "Create Account" : "Welcome learnova"}
        </h2>

        <p className="text-center text-gray-500 mb-6">
          {isRegister ? "Sign up to start learning" : "Sign in to continue"}
        </p>

        {/* FORM */}
        <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">

          {/* REGISTER ONLY */}
          {isRegister && (
            <>
              <input
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 h-10 rounded-xl border"
              />

              <input
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 h-10 rounded-xl border"
              />
            </>
          )}

          {/* EMAIL */}
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 h-10 rounded-xl border"
          />

          {/* PASSWORD */}
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 h-10 rounded-xl border"
          />

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-slate-800 text-white font-semibold"
          >
            {isRegister ? "Create Account" : "Login"}
          </button>

        </form>

        {/* TOGGLE */}
        <p
          onClick={() => setIsRegister(!isRegister)}
          className="text-center mt-4 text-sm text-blue-500 cursor-pointer"
        >
          {isRegister ? "Already have an account? Login" : "Create new account"}
        </p>

      </motion.div>
    </div>
  );
}