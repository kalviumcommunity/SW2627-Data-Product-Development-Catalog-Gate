import { apiFetch } from "./client";

export function getValidationRules() {
  return apiFetch("/api/v1/validation-rules");
}
