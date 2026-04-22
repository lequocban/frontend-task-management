import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import { getApiErrorMessage } from "../lib/api";
import { taskService } from "../services/task.service";
import { userService } from "../services/user.service";

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function fetchUsers() {
      setLoadingUsers(true);
      setError("");

      try {
        const response = await userService.list();

        if (!isCancelled) {
          setUsers(response.users || []);
        }
      } catch (apiError) {
        if (!isCancelled) {
          setError(getApiErrorMessage(apiError));
        }
      } finally {
        if (!isCancelled) {
          setLoadingUsers(false);
        }
      }
    }

    fetchUsers();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError("");

    try {
      const response = await taskService.create(payload);
      const taskId = response.data?._id;

      if (taskId) {
        navigate(`/tasks/${taskId}`, { replace: true });
      } else {
        navigate("/tasks", { replace: true });
      }
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUsers) {
    return (
      <div className="panel panel--light">Đang tải dữ liệu thành viên...</div>
    );
  }

  return (
    <section className="content-stack">
      <header className="page-heading page-heading--dark">
        <div>
          <h1 className="display-title">Tạo nhiệm vụ mới</h1>
          <p className="body-text body-text--light">
            Thiết lập thông tin task và phân công thành viên ngay từ đầu.
          </p>
        </div>

        <Link to="/tasks" className="button button--dark">
          Quay lại danh sách
        </Link>
      </header>

      {error && <p className="feedback feedback--error">{error}</p>}

      <TaskForm
        users={users}
        submitLabel="Tạo task"
        loading={submitting}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
