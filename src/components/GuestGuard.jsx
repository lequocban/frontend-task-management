import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function GuestGuard({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="fullscreen-state">
        <p className="body-text">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  return children;
}
