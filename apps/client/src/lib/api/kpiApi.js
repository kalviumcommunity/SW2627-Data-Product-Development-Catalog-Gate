import { apiFetch } from "./client";

export function getJobsByStatus(status, countOnly = false) {
  const params = new URLSearchParams({
    status,
    count_only: countOnly.toString(),
  });
  return apiFetch(`/api/v1/kpi/jobs-by-status?${params}`);
}

export function getActiveVendors(countOnly = false) {
  const params = new URLSearchParams({
    count_only: countOnly.toString(),
  });
  return apiFetch(`/api/v1/kpi/active-vendors?${params}`);
}

export function getUploadCountsDaywise(nDays = 30) {
  const params = new URLSearchParams({
    n_days: nDays.toString(),
  });
  return apiFetch(`/api/v1/kpi/upload-counts?${params}`);
}

export function getHealth() {
  return apiFetch("/api/v1/kpi/health");
}
