import { Navigate } from "react-router-dom";

const AdminBlockRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Admins should not access billing / plans
  if (user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminBlockRoute;
