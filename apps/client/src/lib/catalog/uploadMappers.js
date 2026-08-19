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

  const totalRules = report?.total_rules ?? 0;
  const failedRules = report?.total_failed_rules ?? 0;
  const passedRules = totalRules > 0 ? totalRules - failedRules : 0;

  return {
    ...upload,
    filename: getFilename(upload.filepath),
    // Dataset profile fields
    row_count: profile?.row_count ?? null,
    column_count: profile?.column_count ?? null,
    duplicate_count: profile?.duplicate_count ?? 0,
    duplicate_percentage: profile?.duplicate_percentage ?? 0,
    // Report fields
    total_rules: totalRules,
    failed_rules: failedRules,
    passed_rules: passedRules,
    // Timestamps
    created_at: formatDateTime(upload.created_at),
    updated_at: formatDateTime(upload.updated_at),
  };
}

export function mapCatalogUploads(uploads = []) {
  return uploads.map(mapCatalogUploadToRow);
}
