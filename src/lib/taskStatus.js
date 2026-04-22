export const DEFAULT_TASK_STATUS = "initial";

export const TASK_STATUS_OPTIONS = [
  { value: "initial", label: "Khởi tạo" },
  { value: "doing", label: "Đang làm" },
  { value: "finish", label: "Hoàn thành" },
  { value: "notFinish", label: "Không hoàn thành" },
  { value: "pending", label: "Tạm hoãn" },
];

export function getTaskStatusLabel(status) {
  const option = TASK_STATUS_OPTIONS.find((item) => item.value === status);

  if (!option) {
    if (!status) {
      const defaultOption = TASK_STATUS_OPTIONS.find(
        (item) => item.value === DEFAULT_TASK_STATUS,
      );
      return defaultOption ? defaultOption.label : DEFAULT_TASK_STATUS;
    }

    return status;
  }

  return option.label;
}

export function getTaskStatusClassName(status) {
  switch (status) {
    case "doing":
      return "status-tag status-tag--doing";
    case "finish":
      return "status-tag status-tag--finish";
    case "notFinish":
      return "status-tag status-tag--not-finish";
    case "pending":
      return "status-tag status-tag--pending";
    default:
      return "status-tag status-tag--initial";
  }
}
