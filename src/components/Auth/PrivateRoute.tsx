import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuthStore } from "../../features/Admin/stores/useAdminAuthStore";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuth = useAdminAuthStore(state => state.isAdminAuthenticated);

  // 초기 상태 렌더링 전에는 로딩 화면 (깜빡임 방지)
  if (isAuth === undefined) return null; // 또는 <Loading message="..." />

  if (!isAuth) return <Navigate to="/admin" replace />; // 인증 안 되면 /admin으로

  return <>{children}</>;
};

export default PrivateRoute;
