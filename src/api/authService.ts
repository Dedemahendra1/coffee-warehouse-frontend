import apiClient from "./axiosConfig";
import { User } from "../types/types";
import { AxiosError } from "axios";

export const authService = {
  fetchUser: async (): Promise<User | null> => {
    try {
      const { data } = await apiClient.get("/user");
      return { ...data, roles: data.roles ?? [] };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Error fetching user.");
      }
      throw new Error("Unexpected error. Please try again.");
    }
  },

  login: async (email: string, password: string): Promise<User> => {
    try {
      const { data } = await apiClient.post(
        "/login",
        { email, password },
      );
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      return { ...data.user, token: data.token, roles: data.user.roles ?? [] };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Invalid credentials.");
      }
      throw new Error("Unexpected error. Please try again.");
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
  },
};
