import { apiFetch } from "./client";

export function getUsers() {
  return apiFetch("/api/v1/users");
}

export function getUserById(userId) {
  return apiFetch(`/api/v1/users/${userId}`);
}