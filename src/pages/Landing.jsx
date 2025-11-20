import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Landing() {
  return (
<div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-50 flex flex-col">


      {/* 🌱 Use same Navbar component */}
      <Navbar
        username={null}
        setUser={() => {}}
        showHomeButton={false}
        showHistoryButton={false}
        showLogoutButton={false}
        showLoginButton={true}
        showRegisterButton={true}
        showLanguageSelector={false}
      />

      {/* ⚡ Hero Section */}
      <div className="flex flex-col items-center text-center px-6 mt-12">
        <h2 className="text-4xl font-extrabold text-green-800 mb-4 max-w-4xl">
          Smart Farming Companion for Sustainable Crop Health Management
        </h2>

        
      </div>

            {/* 🚀 Call to Action */}
      <div className="flex justify-center pb-12">
        <Link to="/login">
          <button className="bg-green-600 text-white px-10 py-4 rounded-xl shadow hover:bg-green-700 transition-all text-lg">
            Get Started
          </button>
        </Link>
      </div>

      {/* 📦 Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-6 pb-10 max-w-6xl mx-auto">
        
        {/* 🖼 Crop Disease Detection */}
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center border border-green-200 hover:shadow-xl hover:border-green-400 transition">
          <div className="text-4xl mb-3"></div>
          <h3 className="text-xl font-bold text-green-700 mb-2">
            AI Crop Disease Detection
          </h3>
          <p className="text-gray-600">
            Upload leaf images and instantly detect crop diseases with accurate AI predictions plus
            recommended treatments.
          </p>
        </div>

        {/* 📊 History Tracking */}
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center border border-green-200 hover:shadow-xl hover:border-green-400 transition">
          <div className="text-4xl mb-3"></div>
          <h3 className="text-xl font-bold text-green-700 mb-2">
            Smart History Tracking
          </h3>
          <p className="text-gray-600">
            View past scans, monitor treatments, and analyze recurring issues to improve crop
            health management.
          </p>
        </div>

        {/* 🤖 AI Chatbot */}
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center border border-green-200 hover:shadow-xl hover:border-green-400 transition">
          <div className="text-4xl mb-3"></div>
          <h3 className="text-xl font-bold text-green-700 mb-2">
            Virtual Agriculture Assistant
          </h3>
          <p className="text-gray-600">
            Ask questions, get fertilizer suggestions, and receive expert guidance through our AI
            powered chatbot.
          </p>
        </div>

      </div>
    </div>
  );
}
