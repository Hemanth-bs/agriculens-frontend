import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const GOOGLE_CLIENT_ID =
  "903401170056-ig22lmqbosd1nj5bsh84mebi52tvh8uv.apps.googleusercontent.com";

function Register({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 👈 NEW
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;

    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleSignup,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-register-btn"),
          { theme: "filled_blue", size: "large", width: "100%" }
        );
      }
    };

    document.body.appendChild(script);
  }, []);

  const handleGoogleSignup = async (response) => {
    setLoading(true); // 👈 START LOADING

    const id_token = response.credential;

    const r = await fetch(
      "https://mithun23112005-agriculens.hf.space/auth/google",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token }),
      }
    );

    const data = await r.json();

    if (r.ok) {
      const userData = {
        username: data.username,
        userId: data.user_id,
        token: data.access_token,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData); // 👈 FIX: Update React state

      toast.success("Signed up with Google!");
      navigate("/home");
    } else {
      toast.error(data.error || "Google signup failed");
    }

    setLoading(false); // 👈 STOP LOADING
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // 👈 START LOADING

    const r = await fetch(
      "https://mithun23112005-agriculens.hf.space/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );

    const data = await r.json();

    if (r.ok) {
      toast.success("Registration successful!");
      navigate("/login");
    } else {
      toast.error(data.error || "Registration failed");
    }

    setLoading(false); // 👈 STOP LOADING
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-sm w-full text-center">
        <img
          src="/Agriculens_icon.png"
          className="w-24 mx-auto mb-5"
          alt="Agriculens Logo"
        />

        <h2 className="text-2xl font-bold text-green-700 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Choose Username"
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Choose Password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded-lg"
          />

          {/* 🔵 Button With Bouncing Dots */}
          <button
            disabled={loading}
            className={`bg-green-600 text-white py-3 rounded-lg flex items-center justify-center ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
            }`}
          >
            {loading ? (
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Disable Google button while loading */}
        <div className="mt-5 flex justify-center">
          {<div id="google-register-btn"></div>}
        </div>

        <p className="text-gray-500 text-sm mt-4">
          Already have an account?
          <Link to="/login" className="text-green-600 ml-1 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
