import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getApiErrorMessage } from "../lib/api";
import { authService } from "../services/auth.service";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuthToken, refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      const response = await authService.register(formData);
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
    <section className="auth-page auth-page--light">
      <div className="hero-panel hero-panel--light">
        <h1 className="hero-title hero-title--dark">Tạo tài khoản mới</h1>
        <p className="hero-subtitle hero-subtitle--dark">
          Bắt đầu tổ chức nhiệm vụ, phân công thành viên và theo dõi tiến độ.
        </p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="section-title">Đăng ký</h2>

        <label className="field">
          <span className="field__label">Họ và tên</span>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
            required
          />
        </label>

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
            placeholder="Tối thiểu 6 ký tự"
            required
          />
        </label>

        {error && <p className="feedback feedback--error">{error}</p>}

        <button
          type="submit"
          className="button button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
        </button>

        <div className="auth-links">
          <Link to="/login" className="pill-link">
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </form>
    </section>
  );
}
