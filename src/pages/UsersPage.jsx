import { useEffect, useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import { formatDateTime } from "../lib/date";
import { getApiErrorMessage } from "../lib/api";
import { userService } from "../services/user.service";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function fetchUsersData() {
      setLoading(true);
      setError("");

      try {
        const [usersResponse, detailResponse] = await Promise.all([
          userService.list(),
          userService.detail(),
        ]);

        if (isCancelled) {
          return;
        }

        const list = usersResponse.users || [];
        setUsers(list);
        setCurrentUser(detailResponse.user || null);

        if (list.length > 0) {
          setSelectedUserId((previous) => previous || list[0]._id);
        }
      } catch (apiError) {
        if (!isCancelled) {
          setError(getApiErrorMessage(apiError));
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchUsersData();

    return () => {
      isCancelled = true;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    if (!keyword.trim()) {
      return users;
    }

    const normalizedKeyword = keyword.toLowerCase();
    return users.filter((user) => {
      return (
        user.fullName?.toLowerCase().includes(normalizedKeyword) ||
        user.email?.toLowerCase().includes(normalizedKeyword)
      );
    });
  }, [keyword, users]);

  const selectedUser = useMemo(() => {
    return filteredUsers.find((user) => user._id === selectedUserId) || null;
  }, [filteredUsers, selectedUserId]);

  const detailUser = useMemo(() => {
    if (!selectedUser) {
      return null;
    }

    if (selectedUser._id === currentUser?._id) {
      return {
        ...selectedUser,
        ...currentUser,
      };
    }

    return selectedUser;
  }, [currentUser, selectedUser]);

  if (loading) {
    return (
      <div className="panel panel--light">Đang tải danh sách người dùng...</div>
    );
  }

  if (error) {
    return (
      <div className="panel panel--light feedback feedback--error">{error}</div>
    );
  }

  return (
    <section className="content-stack">
      <header className="page-heading page-heading--light">
        <div>
          <h1 className="display-title display-title--dark">
            Danh sách người dùng
          </h1>
          <p className="body-text body-text--muted">
            Tra cứu thành viên và xem thông tin tài khoản.
          </p>
        </div>

        <label className="field field--inline">
          <span className="field__label">Tìm kiếm</span>
          <input
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Nhập tên hoặc email"
          />
        </label>
      </header>

      <div className="panel-grid panel-grid--two">
        <section className="panel panel--light">
          <h2 className="section-title">Thành viên</h2>

          {filteredUsers.length === 0 ? (
            <EmptyState
              title="Không có kết quả"
              description="Không tìm thấy người dùng phù hợp với từ khóa hiện tại."
            />
          ) : (
            <ul className="user-list">
              {filteredUsers.map((user) => (
                <li key={user._id}>
                  <button
                    type="button"
                    className={
                      user._id === selectedUserId
                        ? "user-list__item user-list__item--active"
                        : "user-list__item"
                    }
                    onClick={() => setSelectedUserId(user._id)}
                  >
                    <strong>{user.fullName}</strong>
                    <span>{user.email}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel panel--dark">
          <h2 className="section-title section-title--light">
            Chi tiết người dùng
          </h2>

          {detailUser ? (
            <dl className="detail-list">
              <div>
                <dt>Họ và tên</dt>
                <dd>{detailUser.fullName || "Chưa cập nhật"}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{detailUser.email || "Chưa cập nhật"}</dd>
              </div>
              <div>
                <dt>Điện thoại</dt>
                <dd>{detailUser.phone || "Chưa cập nhật"}</dd>
              </div>
              <div>
                <dt>Trạng thái</dt>
                <dd>{detailUser.status || "Chưa cập nhật"}</dd>
              </div>
              <div>
                <dt>ID</dt>
                <dd className="truncate">{detailUser._id}</dd>
              </div>
              <div>
                <dt>Ngày tạo</dt>
                <dd>{formatDateTime(detailUser.createdAt)}</dd>
              </div>
            </dl>
          ) : (
            <p className="body-text body-text--light">
              Chọn một người dùng để xem chi tiết.
            </p>
          )}
        </section>
      </div>
    </section>
  );
}
