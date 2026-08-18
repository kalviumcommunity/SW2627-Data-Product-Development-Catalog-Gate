function formatDateTime(value) {
  if (!value) return "";

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getFilename(filepath) {
  if (!filepath) return "";
  return filepath.split("/").pop();
}

export function mapCatalogUploadToRow(upload) {
  const report = upload.reports?.[0];
  const profile = report?.dataset_profiles?.[0];

  return {
    ...upload,
    batch_id: `#${upload.id.slice(0, 8).toUpperCase()}`,
    filename: getFilename(upload.filepath),
    items_count: profile?.row_count ?? null,
    failed_rules: report?.total_failed_rules ?? 0,
    created_at: formatDateTime(upload.created_at),
    updated_at: formatDateTime(upload.updated_at),
  };
}

export function mapCatalogUploads(uploads = []) {
  return uploads.map(mapCatalogUploadToRow);
}
