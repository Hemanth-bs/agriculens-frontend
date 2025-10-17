import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Login({ setUser }) {
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://mithun23112005-agriculens.hf.space/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password }),
      });

      const data = await response.json();

      if (response.ok && data.user_id && data.access_token) {
        // Store user + access token
        const userData = {
          username: usernameInput,
          userId: data.user_id,
          token: data.access_token
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // persist on reload
        toast.success("Login successful!");
        navigate("/home");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm flex flex-col items-center">
        <img src="/Agriculens_icon.png" alt="Agriculens Logo" className="w-24 h-24 mb-6" />
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Agriculens Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all mt-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
