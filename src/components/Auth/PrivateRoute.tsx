import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuthStore } from "../../features/Admin/stores/useAdminAuthStore";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuth = useAdminAuthStore(state => state.isAdminAuthenticated);

  if (!isAuth) return <Navigate to="/admin" replace />; // 인증 안 되면 /admin으로

  return <>{children}</>;
};

export default PrivateRoute;
