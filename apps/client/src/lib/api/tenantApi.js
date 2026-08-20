import { apiFetch } from "./client";

export function getTenants() {
  return apiFetch("/api/v1/tenants");
}

export function getTenantById(tenantId) {
  return apiFetch(`/api/v1/tenants/${tenantId}`);
}
