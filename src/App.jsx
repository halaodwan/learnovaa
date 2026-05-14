import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Exams from "./pages/Exams";
import Dashboard from "./pages/Dashboard";
import Flashcards from "./pages/Flashcards/Flashcards";
import Explanations from "./pages/Explanations";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  return (
    <BrowserRouter>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLoginSuccess={(token) => {
            localStorage.setItem("token", token);
            setIsLoggedIn(true);
            setShowLogin(false);
          }}
        />
      )}

      {/* Navbar only after login */}
      {isLoggedIn && <Navbar />}

      {/* Routes */}
      <Routes>

        {/* Public route */}
        <Route path="/" element={<Home />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/exams"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Exams />
            </PrivateRoute>
          }
        />

        <Route
          path="/Flashcards"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Flashcards />
            </PrivateRoute>
          }
        />

        <Route
          path="/explanations"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Explanations />
            </PrivateRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;