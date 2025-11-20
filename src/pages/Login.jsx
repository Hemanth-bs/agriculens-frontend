import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const GOOGLE_CLIENT_ID =
  "903401170056-ig22lmqbosd1nj5bsh84mebi52tvh8uv.apps.googleusercontent.com";

function Login({ setUser }) {
  const [usernameInput, setUsernameInput] = useState("");
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
          callback: handleGoogleLogin,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-login-btn"),
          { theme: "filled_blue", size: "large" }
        );
      }
    };

    document.body.appendChild(script);
  }, []);

  const handleGoogleLogin = async (response) => {
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
      setUser(userData);
      toast.success("Logged in with Google!");
      navigate("/home");
    } else {
      toast.error(data.error || "Google login failed");
    }

    setLoading(false); // 👈 STOP LOADING
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // 👈 START LOADING

    const r = await fetch(
      "https://mithun23112005-agriculens.hf.space/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password }),
      }
    );

    const data = await r.json();

    if (r.ok) {
      const userData = {
        username: usernameInput,
        userId: data.user_id,
        token: data.access_token,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      toast.success("Login successful!");
      navigate("/home");
    } else {
      toast.error(data.error || "Login failed");
    }

    setLoading(false); // 👈 STOP LOADING
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm text-center">
        <img
          src="/Agriculens_icon.png"
          className="w-24 mx-auto mb-5"
          alt="Agriculens Logo"
        />

        <h2 className="text-2xl font-bold text-green-700 mb-6">Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="p-3 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded-lg"
          />

          {/* 🔵 Button With Bouncing Dots Loader */}
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
              "Login"
            )}
          </button>
        </form>

        {/* Center the Google button */}
        <div className="mt-5 flex justify-center">
          {<div id="google-login-btn"></div>}
        </div>

        <p className="text-gray-500 text-sm mt-4">
          Don’t have an account?
          <Link to="/register" className="text-green-600 ml-1 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
