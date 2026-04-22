import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { formatDateTime } from "../lib/date";

export default function ProfilePage() {
  const { profile, refreshProfile, isProfileLoading } = useAuth();
  const [notice, setNotice] = useState("");

  const handleRefresh = async () => {
    setNotice("");
    const updated = await refreshProfile();

    if (updated) {
      setNotice("Đã cập nhật thông tin mới nhất từ hệ thống.");
    }
  };

  if (!profile) {
    return (
      <div className="panel panel--light">
        Không tìm thấy thông tin tài khoản.
      </div>
    );
  }

  return (
    <section className="content-stack">
      <header className="page-heading page-heading--dark">
        <h1 className="display-title">Hồ sơ của bạn</h1>
      </header>

      <section className="panel panel--light">
        <dl className="detail-list detail-list--light">
          <div>
            <dt>Họ và tên</dt>
            <dd>{profile.fullName || "Chưa cập nhật"}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{profile.email || "Chưa cập nhật"}</dd>
          </div>
          <div>
            <dt>Điện thoại</dt>
            <dd>{profile.phone || "Chưa cập nhật"}</dd>
          </div>
          <div>
            <dt>Avatar</dt>
            <dd>{profile.avatar || "Chưa cập nhật"}</dd>
          </div>
          <div>
            <dt>Trạng thái</dt>
            <dd>{profile.status || "Chưa cập nhật"}</dd>
          </div>
          <div>
            <dt>Ngày tạo</dt>
            <dd>{formatDateTime(profile.createdAt)}</dd>
          </div>
          <div>
            <dt>Cập nhật gần nhất</dt>
            <dd>{formatDateTime(profile.updatedAt)}</dd>
          </div>
        </dl>

        <div className="form-actions">
          <button
            type="button"
            className="button button--primary"
            onClick={handleRefresh}
          >
            {isProfileLoading ? "Đang tải..." : "Làm mới hồ sơ"}
          </button>
        </div>

        {notice && <p className="feedback feedback--success">{notice}</p>}
      </section>
    </section>
  );
}
