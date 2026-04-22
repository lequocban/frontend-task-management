import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../lib/api";
import { authService } from "../services/auth.service";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await authService.forgotPassword({ email });
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`, {
        state: {
          message: "OTP đã được gửi về email của bạn.",
        },
      });
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page auth-page--dark">
      <div className="hero-panel">
        <h1 className="hero-title">Khôi phục mật khẩu</h1>
        <p className="hero-subtitle">
          Nhập email đã đăng ký để nhận mã OTP trong 5 phút.
        </p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="section-title">Quên mật khẩu</h2>

        <label className="field">
          <span className="field__label">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        {error && <p className="feedback feedback--error">{error}</p>}

        <button
          type="submit"
          className="button button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang gửi OTP..." : "Gửi OTP"}
        </button>

        <div className="auth-links">
          <Link to="/login" className="pill-link">
            Quay lại đăng nhập
          </Link>
        </div>
      </form>
    </section>
  );
}
