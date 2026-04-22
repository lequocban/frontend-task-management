import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getApiErrorMessage } from "../lib/api";
import { authService } from "../services/auth.service";

export default function OtpVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { setAuthToken } = useAuth();

  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    otp: "",
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
      const response = await authService.verifyOtp(formData);
      setAuthToken(response.token);
      navigate("/reset-password", { replace: true });
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page auth-page--light">
      <div className="hero-panel hero-panel--light">
        <h1 className="hero-title hero-title--dark">Xác thực OTP</h1>
        <p className="hero-subtitle hero-subtitle--dark">
          Nhập email và mã OTP để tiếp tục đặt lại mật khẩu.
        </p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="section-title">Mã OTP</h2>

        <label className="field">
          <span className="field__label">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span className="field__label">OTP</span>
          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            placeholder="6 chữ số"
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
          {isSubmitting ? "Đang xác thực..." : "Xác thực OTP"}
        </button>

        <div className="auth-links">
          <Link to="/forgot-password" className="pill-link">
            Gửi lại OTP
          </Link>
        </div>
      </form>
    </section>
  );
}
