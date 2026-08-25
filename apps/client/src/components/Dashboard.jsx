import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCatalogUploads } from "../lib/api/catalogApi";
import { ApiError } from "../lib/api/client";
import { mapCatalogUploads } from "../lib/catalog/uploadMappers";
import DataTable from "./common/DataTable";

const UPLOADS_COLUMNS = [
  {
    key: "id",
    label: "Upload ID",
    isLink: true,
    isId: true,
    linkTarget: "/record?table=catalog_uploads",
  },
  {
    key: "filename",
    label: "File Name",
    isPrimary: true,
  },
  {
    key: "created_at",
    label: "Upload Date",
    isDate: true,
  },
  {
    key: "row_count",
    label: "Rows",
    isNumber: true,
  },
  {
    key: "total_rules",
    label: "Total Rules",
    isNumber: true,
  },
  {
    key: "passed_rules",
    label: "Passed",
    isNumber: true,
  },
  {
    key: "failed_rules",
    label: "Failed",
    isNumber: true,
  },
  {
    key: "warning_count",
    label: "Warnings",
    isNumber: true,
  },
  {
    key: "duplicate_info",
    label: "Duplicates",
  },
  {
    key: "status",
    label: "Status",
    isBadge: true,
  },
];

const CUSTOM_RENDERERS = {
  duplicate_info: (value) => (
    <span className="text-[#1e293b]">{value}</span>
  ),
  warning_count: (value) => {
    if (value === 0 || value === undefined || value === null) {
      return <span className="text-[#94a3b8]">—</span>;
    }
    return (
      <span className="text-[#f59e0b] font-medium">{value}</span>
    );
  },
};

export default function Dashboard() {
  const { user } = useAuth();

  const [uploadsData, setUploadsData] = useState([]);
  const [uploadsLoading, setUploadsLoading] = useState(true);
  const [uploadsError, setUploadsError] = useState("");

  const loadUploads = async () => {
    console.log("loadUploads called");

    setUploadsLoading(true);
    setUploadsError("");

    try {
      console.log("Calling getCatalogUploads...");

      const response = await getCatalogUploads();

      console.log("getCatalogUploads response:", response);

      const mappedData = mapCatalogUploads(response);

      const enrichedData = mappedData.map((upload) => ({
        ...upload,
        duplicate_info:
          upload.duplicate_count > 0
            ? `${upload.duplicate_count} (${upload.duplicate_percentage.toFixed(
                1
              )}%)`
            : "—",
      }));

      // Sort by created_at in descending order (most recent first)
      const sortedData = enrichedData.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setUploadsData(sortedData);
    } catch (error) {
      console.error("Failed to load uploads:", error);

      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to load catalog uploads.";

      setUploadsError(message);
      setUploadsData([]);
    } finally {
      setUploadsLoading(false);
    }
  };

  useEffect(() => {
    loadUploads();
  }, []);

  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <main className="w-full max-w-[1440px] mx-auto px-8 pt-6 pb-4 flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mt-2 mb-2 w-full">
        <div>
          <span className="text-[0.95rem] font-semibold text-[#7aa0ff] block mb-0.5">
            Welcome {displayName}!
          </span>

          <h1 className="text-[2rem] font-normal text-[#1e293b] tracking-tight leading-tight">
            <strong className="font-bold">Dashboard</strong>
          </h1>
        </div>

        <button
          type="button"
          onClick={loadUploads}
          disabled={uploadsLoading}
          className="p-2 border border-[#e2e8f0] hover:bg-slate-100 text-[#64748b] rounded-[6px] bg-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh uploads"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={uploadsLoading ? "animate-spin" : ""}
          >
            <path d="M21.5 2v6h-6" />
            <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
        </button>
      </div>

      {uploadsError && (
        <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {uploadsError}
        </div>
      )}

      {uploadsLoading ? (
        <section className="bg-white border border-[#e2e8f0] rounded-[14px] p-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-center text-sm text-[#64748b]">
          Loading catalog uploads...
        </section>
      ) : (
        <DataTable
          columns={UPLOADS_COLUMNS}
          data={uploadsData}
          totalCount={uploadsData.length}
          entityName="uploads"
          currentTable="catalog_uploads"
          customRenderers={CUSTOM_RENDERERS}
        />
      )}
    </main>
  );
}