import { Navigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  requiredRole: UserRole;
  children: React.ReactNode;
}

const ProtectedRoute = ({ requiredRole, children }: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== requiredRole && role !== "admin") {
    const paths: Record<UserRole, string> = {
      employee: "/employee/dashboard",
      technician: "/technician/dashboard",
      admin: "/admin/dashboard",
    };
    return <Navigate to={paths[role]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
