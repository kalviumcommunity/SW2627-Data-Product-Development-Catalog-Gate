import { apiFetch } from "./client";

export function getCatalogUploads() {
  return apiFetch("/api/v1/catalog/uploads");
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
