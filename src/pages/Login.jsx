import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const GOOGLE_CLIENT_ID =
  "903401170056-ig22lmqbosd1nj5bsh84mebi52tvh8uv.apps.googleusercontent.com";

function Login({ setUser }) {
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const scriptId = "google-identity-script";
  const googleBtnRef = useRef(null);

  useEffect(() => {
    // Inject CSS once to force the Google button and its iframe to be full width
    const styleId = "google-button-fullwidth-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        /* Ensure the GSI button wrapper + inner nodes and iframe stay full width */
        #google-login-btn > div {
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
        }
        #google-login-btn > div > div {
          width: 100% !important;
          min-width: 0 !important;
        }
        #google-login-btn iframe {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
        }
      `;
      document.head.appendChild(style);
    }

    // If the GSI library is already available, render immediately
    if (window.google && window.google.accounts && window.google.accounts.id) {
      tryRenderGoogleButton();
      return;
    }

    // Avoid inserting script twice; if script is already present, wait for it to signal ready
    if (document.getElementById(scriptId)) {
      const handler = () => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
          tryRenderGoogleButton();
          window.removeEventListener("google-loaded", handler);
        }
      };
      window.addEventListener("google-loaded", handler);
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      // notify other listeners that the Google script loaded
      window.dispatchEvent(new Event("google-loaded"));
      tryRenderGoogleButton();
    };

    document.body.appendChild(script);

    // optional cleanup: we intentionally do not remove the script so navigating between pages reuses it.
    // If you want to remove it on unmount, uncomment below:
    // return () => {
    //   const s = document.getElementById(scriptId);
    //   if (s) s.remove();
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // initialize & render function (safe to call multiple times)
  const tryRenderGoogleButton = () => {
    if (!(window.google && window.google.accounts && window.google.accounts.id)) return;

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });

      const container = document.getElementById("google-login-btn");
      if (container) {
        // clear previous content to avoid duplicate buttons
        container.innerHTML = "";
        window.google.accounts.id.renderButton(container, {
          theme: "filled_blue",
          size: "large",
          width: "100%",
        });
      }
    } catch (err) {
      // log but don't break the UI if render/initialize is called repeatedly
      console.error("Error rendering Google button:", err);
    }
  };

  const handleGoogleLogin = async (response) => {
    const id_token = response?.credential;
    if (!id_token) {
      toast.error("Google sign-in failed (no token).");
      return;
    }

    try {
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
    } catch (err) {
      toast.error("Network error during Google login");
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
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
    } catch (err) {
      toast.error("Network error during login");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm">
        <img
          src="/Agriculens_icon.png"
          className="w-24 mx-auto mb-5"
          alt="Agriculens Logo"
        />

        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Login
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="p-3 border rounded-lg w-full"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded-lg w-full"
          />

          <button className="bg-green-600 text-white py-3 rounded-lg w-full">
            Login
          </button>
        </form>

        {/* Full-width Google Button Wrapper */}
        <div className="mt-5 w-full">
          <div id="google-login-btn" ref={googleBtnRef} className="w-full"></div>
        </div>

        <p className="text-gray-500 text-sm mt-4 text-center">
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
