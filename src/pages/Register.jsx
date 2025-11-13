import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const GOOGLE_CLIENT_ID =
  "903401170056-ig22lmqbosd1nj5bsh84mebi52tvh8uv.apps.googleusercontent.com";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const scriptId = "google-identity-script";
  const googleBtnRef = useRef(null);

  useEffect(() => {
    // Add CSS rules to force the Google button to stay full width
    const styleId = "google-button-fullwidth-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        /* target the immediate injected wrapper and the iframe inside it */
        #google-register-btn > div {
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
        }
        #google-register-btn > div > div {
          width: 100% !important;
          min-width: 0 !important;
        }
        #google-register-btn iframe {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Avoid appending the GSI script more than once
    if (window.google && window.google.accounts && window.google.accounts.id) {
      // If already loaded, just render the button
      tryRenderGoogleButton();
      return;
    }

    if (document.getElementById(scriptId)) {
      // Script already added but not ready yet — wait and attempt render once available
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
      // notify other listeners
      window.dispatchEvent(new Event("google-loaded"));
      tryRenderGoogleButton();
    };

    document.body.appendChild(script);

    // cleanup
    return () => {
      // optional: do not remove the script if you navigate between pages and want to reuse it.
      // If you prefer to remove it to force fresh load, uncomment the next lines:
      //
      // const s = document.getElementById(scriptId);
      // if (s) s.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // define the callback separately
  const handleGoogleSignup = async (response) => {
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
    } catch (err) {
      toast.error("Network error during Google signup");
      console.error(err);
    }
  };

  // helper to initialize & render the button (callable anytime the GSI lib is available)
  const tryRenderGoogleButton = () => {
    if (!(window.google && window.google.accounts && window.google.accounts.id)) return;

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleSignup,
      });

      // render into our container; width: "100%" helps but we also rely on the CSS above
      const container = document.getElementById("google-register-btn");
      if (container) {
        // clear any previous content to avoid duplicates
        container.innerHTML = "";
        window.google.accounts.id.renderButton(container, {
          theme: "filled_blue",
          size: "large",
          width: "100%",
        });
      }
    } catch (err) {
      // sometimes initialize/render throws if called repeatedly; swallow but log
      console.error("Error rendering Google button:", err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
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
    } catch (err) {
      toast.error("Network error during registration");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-sm w-full">
        <img
          src="/Agriculens_icon.png"
          className="w-24 mx-auto mb-5"
          alt="Agriculens Logo"
        />

        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Choose Username"
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 border rounded-lg w-full"
          />

          <input
            type="password"
            placeholder="Choose Password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded-lg w-full"
          />

          <button className="bg-green-600 text-white py-3 rounded-lg w-full">
            Register
          </button>
        </form>

        {/* Full-width Google Button Wrapper */}
        <div className="mt-5 w-full">
          <div id="google-register-btn" ref={googleBtnRef} className="w-full"></div>
        </div>

        <p className="text-gray-500 text-sm mt-4 text-center">
          Already have an account?
          <Link to="/" className="text-green-600 ml-1 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
