import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import History from "./pages/History";
import ChatPage from "./pages/ChatPage"; // ✅ NEW IMPORT
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage once at startup
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  // Persist user in localStorage whenever it changes
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  if (loading) {
    // Prevent redirect flicker before localStorage loads
    return (
      <div className="flex items-center justify-center h-screen text-green-700">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          {/* Login and Register */}
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <Login setUser={setUser} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/home" /> : <Register />}
          />

          {/* Protected pages */}
          <Route
            path="/home"
            element={
              <ProtectedRoute username={user?.username}>
                <Home username={user?.username} setUser={setUser} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute username={user?.username}>
                <Upload username={user?.username} setUser={setUser} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/results"
            element={
              <ProtectedRoute username={user?.username}>
                <Results username={user?.username} setUser={setUser} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute username={user?.username}>
                <History username={user?.username} setUser={setUser} />
              </ProtectedRoute>
            }
          />

          {/* ✅ New Chat Page route */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute username={user?.username}>
                <ChatPage username={user?.username} setUser={setUser} />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
