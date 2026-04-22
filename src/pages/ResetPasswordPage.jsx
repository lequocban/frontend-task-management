import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getApiErrorMessage } from "../lib/api";
import { authService } from "../services/auth.service";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.resetPassword({ password: formData.password });
      logout();
      navigate("/login", {
        replace: true,
        state: {
          message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.",
        },
      });
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page auth-page--light auth-page--full">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="section-title">Đặt lại mật khẩu</h2>

        <label className="field">
          <span className="field__label">Mật khẩu mới</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span className="field__label">Xác nhận mật khẩu</span>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>

        {error && <p className="feedback feedback--error">{error}</p>}

        <button
          type="submit"
          className="button button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang cập nhật..." : "Lưu mật khẩu"}
        </button>
      </form>
    </section>
  );
}
