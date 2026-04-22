import api from "../lib/api";

export const userService = {
  async list() {
    const response = await api.get("/users/list");
    return response.data;
  },

  async detail() {
    const response = await api.get("/users/detail");
    return response.data;
  },
};
