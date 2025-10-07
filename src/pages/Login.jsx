import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUsername }) {
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (usernameInput === "admin" && password === "admin") {
      setUsername(usernameInput);
      navigate("/home");
    } else {
      alert("Invalid credentials! Try admin/admin.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm flex flex-col items-center">
        {/* Logo inside the box */}
        <img
          src="/Agriculens_icon.png"
          alt="Agriculens Logo"
          className="w-24 h-24 mb-6"
        />

        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Agriculens Login
        </h2>

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
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all mt-2"
          >
            Login
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-4">
          Use username: <span className="font-medium">admin</span> and password: <span className="font-medium">admin</span>
        </p>
      </div>
    </div>
  );
}

export default Login;