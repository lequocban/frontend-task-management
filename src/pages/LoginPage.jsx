import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getApiErrorMessage } from "../lib/api";
import { authService } from "../services/auth.service";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthToken, refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const notice = location.state?.message || "";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await authService.login(formData);
      setAuthToken(response.token);
      await refreshProfile();
      navigate("/tasks", { replace: true });
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page auth-page--dark">
      <div className="hero-panel">
        <h1 className="hero-title">Task Manage</h1>
        <p className="hero-subtitle">
          Quản trị công việc theo nhóm với giao diện tập trung và tối giản.
        </p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="section-title">Đăng nhập</h2>

        <label className="field">
          <span className="field__label">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="field">
          <span className="field__label">Mật khẩu</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </label>

        {notice && <p className="feedback feedback--success">{notice}</p>}
        {error && <p className="feedback feedback--error">{error}</p>}

        <button
          type="submit"
          className="button button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className="auth-links">
          <Link to="/register" className="pill-link">
            Chưa có tài khoản? Đăng ký
          </Link>
          <Link to="/forgot-password" className="pill-link">
            Quên mật khẩu
          </Link>
        </div>
      </form>
    </section>
  );
}
