import api from "../lib/api";

export const authService = {
  async register(payload) {
    const response = await api.post("/users/register", payload);
    return response.data;
  },

  async login(payload) {
    const response = await api.post("/users/login", payload);
    return response.data;
  },

  async forgotPassword(payload) {
    const response = await api.post("/users/password/forgot", payload);
    return response.data;
  },

  async verifyOtp(payload) {
    const response = await api.post("/users/password/otp", payload);
    return response.data;
  },

  async resetPassword(payload) {
    const response = await api.post("/users/password/reset", payload);
    return response.data;
  },
};
