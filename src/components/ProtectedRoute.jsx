import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, username }) {
  if (!username) {
    return <Navigate to="/" replace />; // redirect if not logged in
  }
  return children;
}