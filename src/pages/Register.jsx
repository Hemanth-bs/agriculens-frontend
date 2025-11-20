import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const GOOGLE_CLIENT_ID =
  "903401170056-ig22lmqbosd1nj5bsh84mebi52tvh8uv.apps.googleusercontent.com";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleSignup,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-register-btn"),
        { theme: "filled_blue", size: "large", width: "100%" }
      );
    };

    document.body.appendChild(script);
  }, []);

  const handleGoogleSignup = async (response) => {
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
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.username,
          userId: data.user_id,
          token: data.access_token,
        })
      );

      toast.success("Signed up with Google!");
      navigate("/home");
    } else {
      toast.error(data.error || "Google signup failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

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
      navigate("/");
    } else {
      toast.error(data.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
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

          <button className="bg-green-600 text-white py-3 rounded-lg">
            Register
          </button>
        </form>

        <div className="mt-5 flex justify-center">
  <div id="google-register-btn"></div>
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
