import { apiFetch } from "./client";

export function getCatalogUploads({ vendor = false } = {}) {
  const params = vendor ? "?vendor=true" : "";
  return apiFetch(`/api/v1/catalog/uploads${params}`);
}

export function getCatalogUploadById(uploadId) {
  return apiFetch(`/api/v1/catalog/uploads/${uploadId}`);
}

export function uploadCatalogFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  console.log("Uploading file:", file.name, "Size:", file.size);
  
  return apiFetch("/api/v1/catalog/upload", {
    method: "POST",
    body: formData,
  });
}

export function getPendingApprovals({ vendor = false } = {}) {
  const params = vendor ? "?vendor=true" : "";
  return apiFetch(`/api/v1/catalog/approvals/pending${params}`);
}

export function approveCatalogUpload(uploadId) {
  return apiFetch(`/api/v1/catalog/uploads/${uploadId}/approve`, {
    method: "PATCH",
  });
}
