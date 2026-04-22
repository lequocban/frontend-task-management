import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="auth-page auth-page--dark auth-page--full">
      <div className="auth-card auth-card--compact">
        <h1 className="section-title">Không tìm thấy trang</h1>
        <p className="body-text body-text--muted">
          Đường dẫn bạn truy cập không tồn tại trong ứng dụng.
        </p>
        <Link to="/tasks" className="button button--primary">
          Về trang nhiệm vụ
        </Link>
      </div>
    </section>
  );
}
