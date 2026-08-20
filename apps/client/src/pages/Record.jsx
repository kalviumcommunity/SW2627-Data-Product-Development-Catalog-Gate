import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getRecord } from "../lib/api/recordApi";
import { ApiError } from "../lib/api/client";

/*
 * Generic foreign-key -> backend table mapping.
 *
 * Examples:
 * user_id           -> users
 * tenant_id         -> tenants
 * report_id         -> reports
 * catalog_upload_id -> catalog_uploads
 */
const FOREIGN_KEY_TABLES = {
  user_id: "users",
  tenant_id: "tenants",
  report_id: "reports",
  catalog_upload_id: "catalog_uploads",
};

/*
 * Keep aliases normalized so existing routes continue to work.
 *
 * /workspace/record/uploads?id=...
 * /workspace/record/catalog_uploads?id=...
 *
 * Both can resolve to catalog_uploads.
 */
const TABLE_ALIASES = {
  uploads: "catalog_uploads",
};

export default function Record() {
  const { table: routeTable } = useParams();
  const [searchParams] = useSearchParams();

  const queryTable = searchParams.get("table");
  const id = searchParams.get("id");

// Query parameter is the canonical source.
// Route parameter remains supported for old URLs.
  const table = queryTable || routeTable;


  /*
   * Use the route table as-is for API requests so the routing logic
   * remains compatible with the existing application.
   */
  const apiTable = table;

  /*
   * Canonical table name used for relationship routing and
   * catalog-upload-specific rendering.
   */
  const normalizedTable =
    TABLE_ALIASES[table] || table;

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!apiTable || !id) {
      setLoading(false);
      setError("Table name and record ID are required.");
      return;
    }

    let isMounted = true;

    async function loadRecord() {
      setLoading(true);
      setError("");
      setRecord(null);

      try {
        console.log("Fetching record:", {
          table: apiTable,
          id,
        });

        const response = await getRecord(apiTable, id);

        console.log("Record response:", response);

        const data = response?.data || response;

        if (
          !data ||
          typeof data !== "object" ||
          Array.isArray(data)
        ) {
          throw new Error("Invalid record response.");
        }

        if (isMounted) {
          setRecord(data);
        }
      } catch (err) {
        console.error(
          `Failed to load ${apiTable} record:`,
          err
        );

        if (isMounted) {
          const message =
            err instanceof ApiError
              ? err.message
              : `Failed to load ${formatLabel(
                  apiTable
                )} record.`;

          setError(message);
          setRecord(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRecord();

    return () => {
      isMounted = false;
    };
  }, [apiTable, id]);

  /*
   * Pull report information out of a catalog_upload record.
   *
   * Supports common response shapes:
   *
   * record.report
   * record.reports
   * record.report_data
   *
   * The API example supplied is an array containing one report,
   * so arrays are handled as well.
   */
  const reports = useMemo(() => {
    if (!record || normalizedTable !== "catalog_uploads") {
      return [];
    }

    const candidates = [
      record.report,
      record.reports,
      record.report_data,
      record.validation_report,
      record.validation_reports,
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate.filter(
          (item) =>
            item &&
            typeof item === "object" &&
            !Array.isArray(item)
        );
      }

      if (
        candidate &&
        typeof candidate === "object" &&
        !Array.isArray(candidate)
      ) {
        return [candidate];
      }
    }

    return [];
  }, [record, normalizedTable]);

  const fields = useMemo(() => {
    if (!record) {
      return [];
    }

    /*
     * Don't render the report relationship as a generic JSON
     * field when we have a dedicated report section below.
     */
    const hiddenKeys =
      normalizedTable === "catalog_uploads"
        ? new Set([
            "report",
            "reports",
            "report_data",
            "validation_report",
            "validation_reports",
          ])
        : new Set();

    return Object.entries(record)
      .filter(([key]) => !hiddenKeys.has(key))
      .map(([key, value]) => ({
        key,
        label: formatLabel(key),
        value,
        type: getFieldType(key, value),
      }));
  }, [record, normalizedTable]);

  const title = record
    ? getRecordTitle(record, normalizedTable)
    : formatLabel(normalizedTable);

  const status = record?.status;

  if (loading) {
    return (
      <main className="w-full max-w-[1440px] mx-auto px-8 pt-6 pb-8">
        <section className="bg-white border border-[#e2e8f0] rounded-[14px] p-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-center text-sm text-[#64748b]">
          Loading record...
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full max-w-[1440px] mx-auto px-8 pt-6 pb-8">
        <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      </main>
    );
  }

  if (!record) {
    return (
      <main className="w-full max-w-[1440px] mx-auto px-8 pt-6 pb-8">
        <section className="bg-white border border-[#e2e8f0] rounded-[14px] p-10 text-center text-sm text-[#64748b]">
          Record not found.
        </section>
      </main>
    );
  }

  return (
    <main className="w-full max-w-[1440px] mx-auto px-8 pt-6 pb-8 flex flex-col gap-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[0.72rem] font-medium text-[#94a3b8]">
        <span>{formatLabel(normalizedTable)}</span>

        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>

        <span className="text-[#64748b]">
          Record
        </span>
      </div>

      {/* Record Header */}
      <section className="bg-white border border-[#e2e8f0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="px-6 py-5 flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 rounded-[10px] bg-[#7aa0ff]/10 border border-[#7aa0ff]/15 flex items-center justify-center flex-shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7aa0ff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line
                  x1="8"
                  y1="13"
                  x2="16"
                  y2="13"
                />
                <line
                  x1="8"
                  y1="17"
                  x2="16"
                  y2="17"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <div className="text-[0.7rem] uppercase tracking-wider font-bold text-[#94a3b8] mb-1">
                {formatLabel(normalizedTable)} Record
              </div>

              <h1 className="text-[1.45rem] font-semibold text-[#1e293b] truncate">
                {title}
              </h1>

              <div className="text-[0.72rem] text-[#94a3b8] mt-1 font-mono truncate">
                {String(record.id || id)}
              </div>
            </div>
          </div>

          {status !== undefined && (
            <StatusBadge status={status} />
          )}
        </div>

        {/* Record metadata */}
        {getHeaderMeta(record).length > 0 && (
          <div className="border-t border-[#f1f5f9] px-6 py-3.5 flex flex-wrap items-center gap-x-8 gap-y-2">
            {getHeaderMeta(record).map((meta) => (
              <HeaderMeta
                key={meta.key}
                label={meta.label}
                value={meta.value}
              />
            ))}
          </div>
        )}
      </section>

      {/* Dynamic Record Fields */}
      <section className="bg-white border border-[#e2e8f0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#f1f5f9]">
          <h2 className="text-[0.75rem] font-bold text-[#64748b] uppercase tracking-wider">
            Record Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {fields.map((field) => (
            <RecordField
              key={field.key}
              field={field}
            />
          ))}
        </div>
      </section>

      {/* Catalog Upload Validation Report */}
      {normalizedTable === "catalog_uploads" &&
        reports.length > 0 && (
          <section className="bg-white border border-[#e2e8f0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[0.75rem] font-bold text-[#64748b] uppercase tracking-wider">
                  Validation Report
                </h2>

                <p className="text-[0.72rem] text-[#94a3b8] mt-1">
                  Validation results generated for this catalog upload.
                </p>
              </div>

              {reports.length > 1 && (
                <span className="text-[0.68rem] font-bold text-[#64748b] uppercase tracking-wide">
                  {reports.length} Reports
                </span>
              )}
            </div>

            <div className="p-6 flex flex-col gap-6">
              {reports.map((report, index) => (
                <ValidationReport
                  key={report.id || index}
                  report={report}
                />
              ))}
            </div>
          </section>
        )}
    </main>
  );
}

function RecordField({ field }) {
  const {
    key,
    label,
    value,
    type,
  } = field;

  /*
   * Foreign-key fields get a clickable link.
   */
  const foreignTable =
    FOREIGN_KEY_TABLES[key];

  if (
    foreignTable &&
    value !== null &&
    value !== undefined &&
    value !== ""
  ) {
    return (
      <div className="px-6 py-4 border-b border-r border-[#f1f5f9] min-h-[78px]">
        <div className="text-[0.68rem] font-semibold text-[#94a3b8] uppercase tracking-wide mb-1.5">
          {label}
        </div>

        <RecordLink
          table={foreignTable}
          id={value}
        />
      </div>
    );
  }

  return (
    <div className="px-6 py-4 border-b border-r border-[#f1f5f9] min-h-[78px]">
      <div className="text-[0.68rem] font-semibold text-[#94a3b8] uppercase tracking-wide mb-1.5">
        {label}
      </div>

      {type === "status" ? (
        <StatusBadge status={value} />
      ) : (
        <div
          className={[
            "text-[0.825rem] font-medium text-[#1e293b] break-words",
            type === "id"
              ? "font-mono text-[0.75rem]"
              : "",
            type === "number"
              ? "tabular-nums"
              : "",
          ].join(" ")}
        >
          {formatValue(value, type)}
        </div>
      )}
    </div>
  );
}

/*
 * Generic clickable record reference.
 *
 * Example:
 *
 * user_id:
 * /workspace/record/users?id=<user_id>
 *
 * tenant_id:
 * /workspace/record/tenants?id=<tenant_id>
 */
function RecordLink({ table, id }) {
  const href = `/record?table=${encodeURIComponent(
    table
  )}&id=${encodeURIComponent(String(id))}`;

  return (
    <Link
      to={href}
      className="inline-flex items-center gap-2 text-[0.78rem] font-semibold text-[#5f86eb] hover:text-[#456ed8] hover:underline break-all"
    >
      <span className="font-mono">
        {String(id)}
      </span>

      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-shrink-0"
      >
        <path d="M7 17L17 7" />
        <path d="M7 7h10v10" />
      </svg>
    </Link>
  );
}

/*
 * Validation report renderer.
 */
function ValidationReport({ report }) {
  const blocked = Array.isArray(report.blocked)
    ? report.blocked
    : [];

  const warnings = Array.isArray(report.warning)
    ? report.warning
    : [];

  const outliers = Array.isArray(report.outliers)
    ? report.outliers
    : [];

  const profiles = Array.isArray(
    report.dataset_profiles
  )
    ? report.dataset_profiles
    : [];

  const failedRules =
    Number(report.total_failed_rules) || 0;

  const totalRules =
    Number(report.total_rules) || 0;

  const passedRules = Math.max(
    totalRules - failedRules,
    0
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Report summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ReportMetric
          label="Total Rules"
          value={totalRules}
        />

        <ReportMetric
          label="Passed"
          value={passedRules}
          variant="success"
        />

        <ReportMetric
          label="Failed"
          value={failedRules}
          variant="danger"
        />

        <ReportMetric
          label="Format"
          value={
            report.ext
              ? String(report.ext).toUpperCase()
              : "—"
          }
        />
      </div>

      {/* Report metadata */}
      <div className="flex flex-wrap gap-x-8 gap-y-2 px-4 py-3 rounded-[10px] bg-slate-50 border border-slate-100">
        {report.id && (
          <ReportMeta
            label="Report ID"
            value={report.id}
            mono
            table="reports"
          />
        )}

        {report.catalog_upload_id && (
          <ReportMeta
            label="Upload"
            value={report.catalog_upload_id}
            mono
            table="catalog_uploads"
          />
        )}

        {report.user_id && (
          <ReportMeta
            label="User"
            value={report.user_id}
            mono
            table="users"
          />
        )}

        {report.tenant_id && (
          <ReportMeta
            label="Tenant"
            value={report.tenant_id}
            mono
            table="tenants"
          />
        )}

        {report.generated_at && (
          <ReportMeta
            label="Generated"
            value={formatDate(
              report.generated_at
            )}
          />
        )}
      </div>

      {/* Blocked rules */}
      <ReportRuleSection
        title="Blocking Rules"
        count={blocked.length}
        variant="danger"
        items={blocked}
      />

      {/* Warnings */}
      <ReportRuleSection
        title="Warnings"
        count={warnings.length}
        variant="warning"
        items={warnings}
      />

      {/* Outliers */}
      {outliers.length > 0 && (
        <ReportOutliers outliers={outliers} />
      )}

      {/* Dataset profiles */}
      {profiles.length > 0 && (
        <DatasetProfiles profiles={profiles} />
      )}

      {/* Empty state */}
      {blocked.length === 0 &&
        warnings.length === 0 &&
        outliers.length === 0 && (
          <div className="rounded-[10px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            No validation issues were reported.
          </div>
        )}
    </div>
  );
}

function ReportMetric({
  label,
  value,
  variant,
}) {
  let classes =
    "bg-slate-50 border-slate-100 text-slate-700";

  if (variant === "success") {
    classes =
      "bg-emerald-50 border-emerald-100 text-emerald-700";
  }

  if (variant === "danger") {
    classes =
      "bg-rose-50 border-rose-100 text-rose-700";
  }

  return (
    <div
      className={`rounded-[10px] border px-4 py-3 ${classes}`}
    >
      <div className="text-[0.65rem] uppercase tracking-wider font-bold opacity-70">
        {label}
      </div>

      <div className="text-[1.15rem] font-bold mt-1 tabular-nums">
        {typeof value === "number"
          ? value.toLocaleString()
          : value}
      </div>
    </div>
  );
}

function ReportMeta({
  label,
  value,
  mono = false,
  table,
}) {
  const content = table ? (
    <RecordLink
      table={table}
      id={value}
    />
  ) : (
    <span
      className={[
        "text-[0.72rem] font-semibold text-[#475569]",
        mono ? "font-mono" : "",
      ].join(" ")}
    >
      {value}
    </span>
  );

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[0.62rem] uppercase tracking-wide font-bold text-[#94a3b8]">
        {label}
      </span>

      {content}
    </div>
  );
}

function ReportRuleSection({
  title,
  count,
  variant,
  items,
}) {
  if (!items.length) {
    return null;
  }

  const isDanger = variant === "danger";

  const badgeClasses = isDanger
    ? "bg-rose-50 text-rose-700 border-rose-200"
    : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <div className="border border-[#e2e8f0] rounded-[10px] overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-[#e2e8f0] flex items-center justify-between">
        <h3 className="text-[0.72rem] font-bold text-[#475569] uppercase tracking-wider">
          {title}
        </h3>

        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[0.62rem] font-bold ${badgeClasses}`}
        >
          {count}
        </span>
      </div>

      <div className="divide-y divide-[#f1f5f9]">
        {items.map((item, index) => (
          <RuleItem
            key={
              item?.rule?.key ||
              `${title}-${index}`
            }
            item={item}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
}

function RuleItem({ item, variant }) {
  const rule = item?.rule || {};
  const result = item?.result || {};

  const failedRows = Array.isArray(
    result.failed_rows
  )
    ? result.failed_rows
    : [];

  const isDanger = variant === "danger";

  const severityClasses = isDanger
    ? "bg-rose-50 text-rose-700 border-rose-200"
    : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <div className="px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {rule.key && (
              <span className="font-mono text-[0.7rem] font-bold text-[#475569]">
                {rule.key}
              </span>
            )}

            {rule.severity && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[0.58rem] font-bold uppercase ${severityClasses}`}
              >
                {rule.severity}
              </span>
            )}
          </div>

          {rule.description && (
            <div className="text-[0.75rem] font-medium text-[#334155] mt-2">
              {rule.description}
            </div>
          )}
        </div>

        {failedRows.length > 0 && (
          <span className="text-[0.64rem] font-semibold text-[#94a3b8]">
            {failedRows.length} failed{" "}
            {failedRows.length === 1
              ? "row"
              : "rows"}
          </span>
        )}
      </div>

      {result.message && (
        <div className="mt-3 rounded-[8px] bg-slate-50 border border-slate-100 px-3 py-2 text-[0.72rem] text-[#475569]">
          {result.message}
        </div>
      )}

      {failedRows.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {failedRows.map((row) => (
            <span
              key={row}
              className="inline-flex items-center px-2 py-1 rounded-[6px] bg-slate-100 text-slate-600 text-[0.62rem] font-mono font-semibold"
            >
              Row {row}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ReportOutliers({ outliers }) {
  return (
    <div className="border border-[#e2e8f0] rounded-[10px] overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-[#e2e8f0]">
        <h3 className="text-[0.72rem] font-bold text-[#475569] uppercase tracking-wider">
          Outliers
        </h3>
      </div>

      <div className="divide-y divide-[#f1f5f9]">
        {outliers.map((group, index) => (
          <div
            key={`${group.column}-${index}`}
            className="px-4 py-4"
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[0.72rem] font-bold text-[#334155] font-mono">
                {group.column}
              </span>

              {group.category && (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[0.6rem] font-semibold">
                  {group.category}
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#f1f5f9]">
                    <th className="px-2 py-2 text-[0.62rem] uppercase tracking-wide text-[#94a3b8]">
                      SKU
                    </th>

                    <th className="px-2 py-2 text-[0.62rem] uppercase tracking-wide text-[#94a3b8]">
                      Value
                    </th>

                    <th className="px-2 py-2 text-[0.62rem] uppercase tracking-wide text-[#94a3b8]">
                      Lower Bound
                    </th>

                    <th className="px-2 py-2 text-[0.62rem] uppercase tracking-wide text-[#94a3b8]">
                      Upper Bound
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {(group.outliers || []).map(
                    (outlier, outlierIndex) => (
                      <tr
                        key={
                          outlier.sku ||
                          outlierIndex
                        }
                        className="border-b border-[#f8fafc] last:border-0"
                      >
                        <td className="px-2 py-2 text-[0.7rem] font-mono font-semibold text-[#475569]">
                          {outlier.sku || "—"}
                        </td>

                        <td className="px-2 py-2 text-[0.7rem] font-semibold text-rose-700 tabular-nums">
                          {formatNumber(
                            outlier.value
                          )}
                        </td>

                        <td className="px-2 py-2 text-[0.7rem] text-[#64748b] tabular-nums">
                          {formatNumber(
                            outlier.lower_bound
                          )}
                        </td>

                        <td className="px-2 py-2 text-[0.7rem] text-[#64748b] tabular-nums">
                          {formatNumber(
                            outlier.upper_bound
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DatasetProfiles({ profiles }) {
  return (
    <div className="border border-[#e2e8f0] rounded-[10px] overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-[#e2e8f0]">
        <h3 className="text-[0.72rem] font-bold text-[#475569] uppercase tracking-wider">
          Dataset Profile
        </h3>
      </div>

      <div className="p-4 flex flex-col gap-5">
        {profiles.map((profile, index) => (
          <div
            key={profile.id || index}
            className="flex flex-col gap-4"
          >
            {/* Profile summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ProfileMetric
                label="Rows"
                value={profile.row_count}
              />

              <ProfileMetric
                label="Columns"
                value={profile.column_count}
              />

              <ProfileMetric
                label="Duplicates"
                value={profile.duplicate_count}
              />

              <ProfileMetric
                label="Duplicate %"
                value={
                  profile.duplicate_percentage !==
                  undefined
                    ? `${Number(
                        profile.duplicate_percentage
                      ).toFixed(1)}%`
                    : "—"
                }
              />
            </div>

            {/* Columns */}
            {Array.isArray(
              profile.columns
            ) &&
              profile.columns.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#e2e8f0]">
                        <th className="px-2 py-2 text-[0.62rem] uppercase tracking-wide text-[#94a3b8]">
                          Column
                        </th>

                        <th className="px-2 py-2 text-[0.62rem] uppercase tracking-wide text-[#94a3b8]">
                          Type
                        </th>

                        <th className="px-2 py-2 text-[0.62rem] uppercase tracking-wide text-[#94a3b8]">
                          Nulls
                        </th>

                        <th className="px-2 py-2 text-[0.62rem] uppercase tracking-wide text-[#94a3b8]">
                          Unique
                        </th>

                        <th className="px-2 py-2 text-[0.62rem] uppercase tracking-wide text-[#94a3b8]">
                          Null %
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {profile.columns.map(
                        (column) => (
                          <tr
                            key={
                              column.name
                            }
                            className="border-b border-[#f8fafc] last:border-0"
                          >
                            <td className="px-2 py-2 text-[0.7rem] font-mono font-semibold text-[#334155]">
                              {column.name}
                            </td>

                            <td className="px-2 py-2 text-[0.7rem] text-[#64748b]">
                              {column.dtype ||
                                "—"}
                            </td>

                            <td className="px-2 py-2 text-[0.7rem] text-[#64748b] tabular-nums">
                              {formatNumber(
                                column.null_count
                              )}
                            </td>

                            <td className="px-2 py-2 text-[0.7rem] text-[#64748b] tabular-nums">
                              {formatNumber(
                                column.unique_count
                              )}
                            </td>

                            <td className="px-2 py-2 text-[0.7rem] text-[#64748b] tabular-nums">
                              {column.null_percentage !==
                              undefined
                                ? `${Number(
                                    column.null_percentage
                                  ).toFixed(
                                    1
                                  )}%`
                                : "—"}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}

            {/* Numerical profile */}
            {profile.numerical_profile &&
              Object.keys(
                profile.numerical_profile
              ).length > 0 && (
                <div>
                  <div className="text-[0.65rem] uppercase tracking-wider font-bold text-[#94a3b8] mb-2">
                    Numerical Profile
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(
                      profile.numerical_profile
                    ).map(
                      ([
                        columnName,
                        stats,
                      ]) => (
                        <div
                          key={columnName}
                          className="rounded-[8px] border border-[#e2e8f0] p-3"
                        >
                          <div className="font-mono text-[0.7rem] font-bold text-[#475569] mb-2">
                            {columnName}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <ProfileStat
                              label="Min"
                              value={
                                stats.min
                              }
                            />

                            <ProfileStat
                              label="Max"
                              value={
                                stats.max
                              }
                            />

                            <ProfileStat
                              label="Mean"
                              value={
                                stats.mean
                              }
                            />

                            <ProfileStat
                              label="Median"
                              value={
                                stats.median
                              }
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileMetric({ label, value }) {
  return (
    <div className="rounded-[8px] bg-slate-50 border border-slate-100 px-3 py-2">
      <div className="text-[0.6rem] uppercase tracking-wide font-bold text-[#94a3b8]">
        {label}
      </div>

      <div className="text-[0.82rem] font-bold text-[#475569] mt-1 tabular-nums">
        {value === null ||
        value === undefined
          ? "—"
          : typeof value === "number"
          ? value.toLocaleString()
          : value}
      </div>
    </div>
  );
}

function ProfileStat({ label, value }) {
  return (
    <div>
      <div className="text-[0.58rem] uppercase tracking-wide font-semibold text-[#94a3b8]">
        {label}
      </div>

      <div className="text-[0.68rem] font-semibold text-[#475569] mt-0.5 tabular-nums">
        {formatNumber(value)}
      </div>
    </div>
  );
}

function getFieldType(key, value) {
  const normalizedKey =
    String(key).toLowerCase();

  if (normalizedKey === "status") {
    return "status";
  }

  if (
    normalizedKey === "id" ||
    normalizedKey.endsWith("_id")
  ) {
    return "id";
  }

  if (
    normalizedKey.includes("date") ||
    normalizedKey.endsWith("_at") ||
    normalizedKey.endsWith("_on")
  ) {
    return "date";
  }

  if (
    normalizedKey.includes("percentage") ||
    normalizedKey.includes("percent")
  ) {
    return "percentage";
  }

  if (typeof value === "number") {
    return "number";
  }

  if (typeof value === "boolean") {
    return "boolean";
  }

  return "text";
}

function formatValue(value, type) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  if (typeof value === "object") {
    return (
      <pre className="whitespace-pre-wrap break-words text-[0.7rem] leading-relaxed font-mono text-[#475569]">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  switch (type) {
    case "date":
      return formatDate(value);

    case "number":
      return formatNumber(value);

    case "percentage": {
      const number = Number(value);

      if (Number.isNaN(number)) {
        return String(value);
      }

      return `${number.toFixed(1)}%`;
    }

    case "boolean":
      return value ? "Yes" : "No";

    default:
      return String(value);
  }
}

function getRecordTitle(record, table) {
  const preferredKeys = [
    "name",
    "filename",
    "title",
    "email",
    "label",
  ];

  for (const key of preferredKeys) {
    if (
      record[key] !== null &&
      record[key] !== undefined &&
      String(record[key]).trim() !== ""
    ) {
      return String(record[key]);
    }
  }

  return `${formatLabel(table)} Record`;
}

function getHeaderMeta(record) {
  const metadata = [];

  const candidates = [
    ["created_at", "Created"],
    ["updated_at", "Updated"],
    ["email", "Email"],
    ["user_role", "Role"],
    ["row_count", "Rows"],
  ];

  for (const [key, label] of candidates) {
    if (
      record[key] !== null &&
      record[key] !== undefined &&
      record[key] !== ""
    ) {
      let value = record[key];

      if (
        key.endsWith("_at") ||
        key.endsWith("_on")
      ) {
        value = formatDate(value);
      } else if (
        typeof value === "number"
      ) {
        value = formatNumber(value);
      } else {
        value = String(value);
      }

      metadata.push({
        key,
        label,
        value,
      });
    }
  }

  return metadata;
}

function formatLabel(value) {
  if (!value) {
    return "";
  }

  return String(value)
    .replace(
      /([a-z])([A-Z])/g,
      "$1 $2"
    )
    .replace(
      /[_-]+/g,
      " "
    )
    .replace(
      /\b\w/g,
      (char) => char.toUpperCase()
    );
}

function formatNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return String(value);
  }

  return number.toLocaleString();
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

function HeaderMeta({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[0.67rem] uppercase tracking-wide font-semibold text-[#94a3b8]">
        {label}
      </span>

      <span className="text-[0.72rem] font-semibold text-[#475569]">
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = String(
    status || ""
  ).toLowerCase();

  let classes =
    "bg-slate-100 text-slate-600 border-slate-200";

  if (
    [
      "passed",
      "success",
      "active",
      "completed",
    ].includes(normalized)
  ) {
    classes =
      "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (
    [
      "failed",
      "error",
      "inactive",
      "rejected",
    ].includes(normalized)
  ) {
    classes =
      "bg-rose-50 text-rose-700 border-rose-200";
  } else if (
    [
      "processing",
      "pending",
      "in_progress",
    ].includes(normalized)
  ) {
    classes =
      "bg-amber-50 text-amber-700 border-amber-200";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[0.68rem] font-bold uppercase tracking-wide ${classes}`}
    >
      {status || "Unknown"}
    </span>
  );
}