import { useState } from "react";
import { toApiDateTime, toDateTimeInput } from "../lib/date";
import { DEFAULT_TASK_STATUS, TASK_STATUS_OPTIONS } from "../lib/taskStatus";

function buildInitialState(initialData) {
  if (!initialData) {
    return {
      title: "",
      status: DEFAULT_TASK_STATUS,
      content: "",
      timeStart: "",
      timeFinish: "",
      listUser: [],
    };
  }

  return {
    title: initialData.title || "",
    status: initialData.status || DEFAULT_TASK_STATUS,
    content: initialData.content || "",
    timeStart: toDateTimeInput(initialData.timeStart),
    timeFinish: toDateTimeInput(initialData.timeFinish),
    listUser: Array.isArray(initialData.listUser)
      ? initialData.listUser.map((item) =>
          typeof item === "string" ? item : item?._id,
        )
      : [],
  };
}

export default function TaskForm({
  initialData,
  users,
  submitLabel,
  loading,
  onSubmit,
}) {
  const [formData, setFormData] = useState(() =>
    buildInitialState(initialData),
  );
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleToggleMember = (userId) => {
    setFormData((previous) => {
      const listUser = previous.listUser.includes(userId)
        ? previous.listUser.filter((item) => item !== userId)
        : [...previous.listUser, userId];

      return {
        ...previous,
        listUser,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Vui lòng nhập tiêu đề task.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      status: formData.status,
      content: formData.content.trim(),
      timeStart: toApiDateTime(formData.timeStart),
      timeFinish: toApiDateTime(formData.timeFinish),
      listUser: formData.listUser,
    };

    await onSubmit(payload);
  };

  return (
    <form className="panel panel--light task-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="field">
          <span className="field__label">Tiêu đề</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ví dụ: Thiết kế luồng đăng nhập"
            required
          />
        </label>

        <label className="field">
          <span className="field__label">Trạng thái</span>
          <select name="status" value={formData.status} onChange={handleChange}>
            {TASK_STATUS_OPTIONS.map((statusOption) => (
              <option key={statusOption.value} value={statusOption.value}>
                {statusOption.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Bắt đầu</span>
          <input
            type="datetime-local"
            name="timeStart"
            value={formData.timeStart}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span className="field__label">Kết thúc</span>
          <input
            type="datetime-local"
            name="timeFinish"
            value={formData.timeFinish}
            onChange={handleChange}
          />
        </label>
      </div>

      <label className="field">
        <span className="field__label">Mô tả</span>
        <textarea
          name="content"
          rows={4}
          value={formData.content}
          onChange={handleChange}
          placeholder="Mô tả mục tiêu, đầu ra và lưu ý"
        />
      </label>

      <section>
        <h3 className="card-title">Thành viên tham gia</h3>
        <div className="member-grid">
          {users.map((user) => {
            const checked = formData.listUser.includes(user._id);

            return (
              <label
                key={user._id}
                className={
                  checked ? "member-chip member-chip--checked" : "member-chip"
                }
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggleMember(user._id)}
                />
                <span>{user.fullName}</span>
                <small>{user.email}</small>
              </label>
            );
          })}
        </div>
      </section>

      {error && <p className="feedback feedback--error">{error}</p>}

      <div className="form-actions">
        <button
          type="submit"
          className="button button--primary"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
