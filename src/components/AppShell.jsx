import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const navItems = [
  { to: "/tasks", label: "Nhiệm vụ" },
  { to: "/tasks/create", label: "Tạo task" },
  { to: "/users", label: "Người dùng" },
  { to: "/profile", label: "Tài khoản" },
];

export default function AppShell() {
  const navigate = useNavigate();
  const { profile, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <header className="top-nav">
        <div className="top-nav__inner">
          <NavLink to="/tasks" className="brand-link">
            Task Manage
          </NavLink>

          <nav className="top-nav__links">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? "top-nav__link top-nav__link--active"
                    : "top-nav__link"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="top-nav__actions">
            <span className="top-nav__user">
              {profile?.fullName || profile?.email || "Người dùng"}
            </span>
            <button
              type="button"
              className="button button--dark"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}
