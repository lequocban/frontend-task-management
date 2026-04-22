import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { formatDateTime } from "../lib/date";
import { getApiErrorMessage } from "../lib/api";
import {
  DEFAULT_TASK_STATUS,
  TASK_STATUS_OPTIONS,
  getTaskStatusClassName,
  getTaskStatusLabel,
} from "../lib/taskStatus";
import { taskService } from "../services/task.service";
import { userService } from "../services/user.service";

const defaultFilters = {
  keyword: "",
  status: "",
  sortKey: "createdAt",
  sortValue: "desc",
  page: 1,
  limit: 6,
};

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Ngày tạo - Mới nhất" },
  { value: "createdAt:asc", label: "Ngày tạo - Cũ nhất" },
  { value: "timeFinish:asc", label: "Thời gian hoàn thành - Tăng dần" },
  { value: "timeFinish:desc", label: "Thời gian hoàn thành - Giảm dần" },
  { value: "timeStart:asc", label: "Thời gian bắt đầu - Tăng dần" },
  { value: "timeStart:desc", label: "Thời gian bắt đầu - Giảm dần" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [keywordInput, setKeywordInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function fetchTasks() {
      setLoading(true);
      setError("");

      try {
        const [tasksResponse, usersResponse] = await Promise.all([
          taskService.list(filters),
          userService.list(),
        ]);

        if (isCancelled) {
          return;
        }

        setTasks(Array.isArray(tasksResponse) ? tasksResponse : []);
        setUsers(usersResponse.users || []);
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

    fetchTasks();

    return () => {
      isCancelled = true;
    };
  }, [filters]);

  const userMap = useMemo(() => {
    const map = new Map();

    users.forEach((user) => {
      map.set(user._id, user.fullName);
    });

    return map;
  }, [users]);

  const canGoNext = tasks.length >= filters.limit;

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setFilters((previous) => ({
      ...previous,
      page: 1,
      keyword: keywordInput.trim(),
    }));
  };

  const handleFilterChange = (name, value) => {
    setFilters((previous) => ({
      ...previous,
      page: 1,
      [name]: value,
    }));
  };

  const handleSortChange = (value) => {
    const [sortKey, sortValue] = value.split(":");

    setFilters((previous) => ({
      ...previous,
      page: 1,
      sortKey,
      sortValue,
    }));
  };

  const handleChangeStatus = async (taskId, nextStatus) => {
    try {
      await taskService.changeStatus(taskId, nextStatus);
      setTasks((previous) =>
        previous.map((task) =>
          task._id === taskId
            ? {
                ...task,
                status: nextStatus,
              }
            : task,
        ),
      );
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    }
  };

  const handleDelete = async (taskId) => {
    const accepted = window.confirm("Bạn có chắc muốn xóa task này?");

    if (!accepted) {
      return;
    }

    try {
      await taskService.remove(taskId);
      setTasks((previous) => previous.filter((task) => task._id !== taskId));
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    }
  };

  return (
    <section className="content-stack">
      <header className="page-heading page-heading--dark">
        <div>
          <h1 className="display-title">Task Dashboard</h1>
          <p className="body-text body-text--light">
            Theo dõi, cập nhật trạng thái và truy cập chi tiết từng nhiệm vụ.
          </p>
        </div>

        <Link to="/tasks/create" className="button button--primary">
          Tạo task mới
        </Link>
      </header>

      <section className="panel panel--light">
        <form className="toolbar" onSubmit={handleSearchSubmit}>
          <label className="field field--inline">
            <span className="field__label">Từ khóa</span>
            <input
              type="search"
              value={keywordInput}
              onChange={(event) => setKeywordInput(event.target.value)}
              placeholder="Tìm theo tiêu đề"
            />
          </label>

          <label className="field field--inline">
            <span className="field__label">Trạng thái</span>
            <select
              value={filters.status}
              onChange={(event) =>
                handleFilterChange("status", event.target.value)
              }
            >
              <option value="">Tất cả</option>
              {TASK_STATUS_OPTIONS.map((statusOption) => (
                <option key={statusOption.value} value={statusOption.value}>
                  {statusOption.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field field--inline">
            <span className="field__label">Sắp xếp</span>
            <select
              value={`${filters.sortKey}:${filters.sortValue}`}
              onChange={(event) => handleSortChange(event.target.value)}
            >
              {SORT_OPTIONS.map((sortOption) => (
                <option key={sortOption.value} value={sortOption.value}>
                  {sortOption.label}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="button button--dark">
            Áp dụng
          </button>
        </form>

        {error && <p className="feedback feedback--error">{error}</p>}

        {loading ? (
          <p className="body-text">Đang tải danh sách task...</p>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="Chưa có task"
            description="Hãy tạo task mới hoặc thay đổi bộ lọc để hiển thị dữ liệu."
            action={
              <Link to="/tasks/create" className="button button--primary">
                Tạo task
              </Link>
            }
          />
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <article key={task._id} className="task-card">
                <div className="task-card__header">
                  <h3 className="card-title">{task.title}</h3>
                  <span className={getTaskStatusClassName(task.status)}>
                    {getTaskStatusLabel(task.status)}
                  </span>
                </div>

                <p className="body-text body-text--muted line-clamp">
                  {task.content || "Không có mô tả"}
                </p>

                <dl className="meta-list">
                  <div>
                    <dt>Bắt đầu</dt>
                    <dd>{formatDateTime(task.timeStart)}</dd>
                  </div>
                  <div>
                    <dt>Kết thúc</dt>
                    <dd>{formatDateTime(task.timeFinish)}</dd>
                  </div>
                </dl>

                <div className="chip-list">
                  {(task.listUser || []).map((memberId) => {
                    const userId =
                      typeof memberId === "string" ? memberId : memberId?._id;
                    return (
                      <span key={userId} className="chip">
                        {userMap.get(userId) || "Thành viên"}
                      </span>
                    );
                  })}
                </div>

                <div className="task-card__actions">
                  <select
                    value={task.status || DEFAULT_TASK_STATUS}
                    onChange={(event) =>
                      handleChangeStatus(task._id, event.target.value)
                    }
                  >
                    {TASK_STATUS_OPTIONS.map((statusOption) => (
                      <option
                        key={statusOption.value}
                        value={statusOption.value}
                      >
                        {statusOption.label}
                      </option>
                    ))}
                  </select>

                  <Link to={`/tasks/${task._id}`} className="pill-link">
                    Chi tiết
                  </Link>
                  <button
                    type="button"
                    className="pill-link pill-link--danger"
                    onClick={() => handleDelete(task._id)}
                  >
                    Xóa
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="pagination-row">
          <button
            type="button"
            className="button button--dark"
            onClick={() =>
              setFilters((previous) => ({
                ...previous,
                page: Math.max(1, previous.page - 1),
              }))
            }
            disabled={filters.page === 1}
          >
            Trang trước
          </button>

          <span className="body-text">Trang {filters.page}</span>

          <button
            type="button"
            className="button button--dark"
            onClick={() =>
              setFilters((previous) => ({
                ...previous,
                page: previous.page + 1,
              }))
            }
            disabled={!canGoNext}
          >
            Trang sau
          </button>
        </div>
      </section>
    </section>
  );
}
