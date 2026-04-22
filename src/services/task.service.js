import api from "../lib/api";

export const taskService = {
  async list(params = {}) {
    const response = await api.get("/tasks", {
      params,
    });
    return response.data;
  },

  async detail(id) {
    const response = await api.get(`/tasks/detail/${id}`);
    return response.data;
  },

  async create(payload) {
    const response = await api.post("/tasks/create", payload);
    return response.data;
  },

  async edit(id, payload) {
    const response = await api.patch(`/tasks/edit/${id}`, payload);
    return response.data;
  },

  async changeStatus(id, status) {
    const response = await api.patch(`/tasks/change-status/${id}`, { status });
    return response.data;
  },

  async changeMulti(payload) {
    const response = await api.patch("/tasks/change-multi", payload);
    return response.data;
  },

  async remove(id) {
    const response = await api.delete(`/tasks/delete/${id}`);
    return response.data;
  },
};
