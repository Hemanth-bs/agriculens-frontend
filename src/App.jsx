import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [username, setUsername] = useState(""); // App-level username

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Login setUsername={setUsername} />} 
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute username={username}>
              <Home username={username} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute username={username}>
              <Upload username={username} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results"
          element={
            <ProtectedRoute username={username}>
              <Results username={username} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;