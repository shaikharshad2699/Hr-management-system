import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://hr-management-system-idez.onrender.com/api",
  headers: {
    "Content-Type": "application/json"
  }
});