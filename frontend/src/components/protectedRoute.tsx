import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    console.log("ProtectedRoute - token:", token);
    console.log("ProtectedRoute - role:", role);

    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    console.warn("No token, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole || "")) {
    console.warn("Role not allowed:", userRole);
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-semibold mb-2 text-red-600">Access Denied</h2>
        <p className="text-gray-600">You don’t have permission to view this page.</p>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
