import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import AppShell from "./components/AppShell";
import AuthGuard from "./components/AuthGuard";
import GuestGuard from "./components/GuestGuard";
import { AuthProvider } from "./context/AuthContext";
import CreateTaskPage from "./pages/CreateTaskPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import OtpVerifyPage from "./pages/OtpVerifyPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import TasksPage from "./pages/TasksPage";
import UsersPage from "./pages/UsersPage";

function GuestLayout() {
  return (
    <GuestGuard>
      <Outlet />
    </GuestGuard>
  );
}

function ProtectedLayout() {
  return (
    <AuthGuard>
      <AppShell />
    </AuthGuard>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" replace />} />

          <Route element={<GuestLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-otp" element={<OtpVerifyPage />} />
          </Route>

          <Route element={<ProtectedLayout />}>
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/create" element={<CreateTaskPage />} />
            <Route path="/tasks/:id" element={<TaskDetailPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
