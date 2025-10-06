import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ username, showAuthButtons = true }) {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Website Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
          <img
            src="/Agriculens_icon.png"
            alt="Agriculens Logo"
            className="w-10 h-10"
          />
          <span className="text-xl font-bold text-green-700">
            Agriculens
          </span>
        </div>

        {/* Right side buttons */}
        {showAuthButtons && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/home")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
