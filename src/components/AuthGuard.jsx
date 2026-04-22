import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function AuthGuard({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="fullscreen-state">
        <p className="body-text">Đang kiểm tra phiên đăng nhập...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
