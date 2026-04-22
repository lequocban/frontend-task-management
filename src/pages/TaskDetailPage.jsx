import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import { formatDateTime } from "../lib/date";
import { getApiErrorMessage } from "../lib/api";
import { DEFAULT_TASK_STATUS, TASK_STATUS_OPTIONS } from "../lib/taskStatus";
import { taskService } from "../services/task.service";
import { userService } from "../services/user.service";

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function fetchDetail() {
      setLoading(true);
      setError("");

      try {
        const [taskResponse, usersResponse] = await Promise.all([
          taskService.detail(id),
          userService.list(),
        ]);

        if (isCancelled) {
          return;
        }

        setTask(taskResponse);
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

    fetchDetail();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  const memberNames = useMemo(() => {
    const map = new Map();

    users.forEach((user) => {
      map.set(user._id, user.fullName);
    });

    return (task?.listUser || []).map((member) => {
      const userId = typeof member === "string" ? member : member?._id;
      return {
        userId,
        name: map.get(userId) || "Thành viên",
      };
    });
  }, [task?.listUser, users]);

  const handleSubmit = async (payload) => {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      await taskService.edit(id, payload);
      setTask((previous) => ({
        ...previous,
        ...payload,
      }));
      setNotice("Đã cập nhật task thành công.");
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setSaving(false);
    }
  };

  const handleChangeStatus = async (event) => {
    const nextStatus = event.target.value;
    setChangingStatus(true);
    setError("");
    setNotice("");

    try {
      await taskService.changeStatus(id, nextStatus);
      setTask((previous) => ({
        ...previous,
        status: nextStatus,
      }));
      setNotice("Đã thay đổi trạng thái task.");
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setChangingStatus(false);
    }
  };

  const handleDelete = async () => {
    const accepted = window.confirm("Bạn chắc chắn muốn xóa task này?");

    if (!accepted) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await taskService.remove(id);
      navigate("/tasks", { replace: true });
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    }
  };

  if (loading) {
    return <div className="panel panel--light">Đang tải chi tiết task...</div>;
  }

  if (!task) {
    return (
      <div className="panel panel--light">
        Task không tồn tại hoặc đã bị xóa.
      </div>
    );
  }

  return (
    <section className="content-stack">
      <header className="page-heading page-heading--dark">
        <div>
          <h1 className="display-title">Chi tiết nhiệm vụ</h1>
          <p className="body-text body-text--light">
            Cập nhật nội dung, thêm hoặc xóa thành viên tham gia task.
          </p>
        </div>

        <div className="heading-actions">
          <Link to="/tasks" className="button button--dark">
            Quay lại
          </Link>
          <button
            type="button"
            className="button button--danger"
            onClick={handleDelete}
          >
            Xóa task
          </button>
        </div>
      </header>

      <section className="panel-grid panel-grid--two">
        <article className="panel panel--dark">
          <h2 className="section-title section-title--light">Tổng quan</h2>

          <dl className="detail-list">
            <div>
              <dt>Tiêu đề</dt>
              <dd>{task.title}</dd>
            </div>
            <div>
              <dt>Trạng thái</dt>
              <dd>
                <select
                  value={task.status || DEFAULT_TASK_STATUS}
                  onChange={handleChangeStatus}
                  disabled={changingStatus}
                >
                  {TASK_STATUS_OPTIONS.map((statusOption) => (
                    <option key={statusOption.value} value={statusOption.value}>
                      {statusOption.label}
                    </option>
                  ))}
                </select>
              </dd>
            </div>
            <div>
              <dt>Bắt đầu</dt>
              <dd>{formatDateTime(task.timeStart)}</dd>
            </div>
            <div>
              <dt>Kết thúc</dt>
              <dd>{formatDateTime(task.timeFinish)}</dd>
            </div>
            <div>
              <dt>Ngày tạo</dt>
              <dd>{formatDateTime(task.createdAt)}</dd>
            </div>
            <div>
              <dt>Cập nhật</dt>
              <dd>{formatDateTime(task.updatedAt)}</dd>
            </div>
          </dl>

          <h3 className="card-title card-title--light">Thành viên</h3>
          <div className="chip-list">
            {memberNames.length === 0 ? (
              <span className="body-text body-text--light">
                Chưa có thành viên
              </span>
            ) : (
              memberNames.map((member) => (
                <span key={member.userId} className="chip chip--dark">
                  {member.name}
                </span>
              ))
            )}
          </div>
        </article>

        <div>
          <TaskForm
            key={task._id}
            initialData={task}
            users={users}
            submitLabel="Lưu thay đổi"
            loading={saving}
            onSubmit={handleSubmit}
          />
        </div>
      </section>

      {notice && <p className="feedback feedback--success">{notice}</p>}
      {error && <p className="feedback feedback--error">{error}</p>}
    </section>
  );
}
