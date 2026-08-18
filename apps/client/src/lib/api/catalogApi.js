import { apiFetch } from "./client";

export function getCatalogUploads() {
  return apiFetch("/api/v1/catalog/uploads");
}
