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
  
  // Extract warning count from the warning jsonb field
  const warningData = report?.warning;
  let warningCount = 0;
  if (warningData) {
    if (Array.isArray(warningData)) {
      warningCount = warningData.length;
    } else if (typeof warningData === 'object') {
      warningCount = Object.keys(warningData).length;
    }
  }

  // Flatten the joined vendor (users) data when present.
  const vendor = upload.users ?? null;

  return {
    ...upload,
    filename: getFilename(upload.filepath),
    // Vendor fields (populated when ?vendor=true was used)
    vendor_id: vendor?.id ?? null,
    vendor_name: vendor?.name ?? null,
    vendor_phone: vendor?.phone ?? null,
    vendor_role: vendor?.user_role ?? null,
    // Dataset profile fields
    row_count: profile?.row_count ?? null,
    column_count: profile?.column_count ?? null,
    duplicate_count: profile?.duplicate_count ?? 0,
    duplicate_percentage: profile?.duplicate_percentage ?? 0,
    // Report fields
    total_rules: totalRules,
    failed_rules: failedRules,
    passed_rules: passedRules,
    warning_count: warningCount,
    // Timestamps
    created_at: formatDateTime(upload.created_at),
    updated_at: formatDateTime(upload.updated_at),
  };
}

export function mapCatalogUploads(uploads = []) {
  return uploads.map(mapCatalogUploadToRow);
}
