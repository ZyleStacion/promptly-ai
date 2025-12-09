// src/components/Admin/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in → redirect to /signin
  if (!user) return <Navigate to="/signin" replace />;

  // Logged in but NOT admin → redirect to dashboard or home
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;

  // User is admin → allow
  return children;
};

export default AdminRoute;
