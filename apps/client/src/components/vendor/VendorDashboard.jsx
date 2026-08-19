import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCatalogUploads } from "../../lib/api/catalogApi";
import { ApiError } from "../../lib/api/client";
import { mapCatalogUploads } from "../../lib/catalog/uploadMappers";
import DataTable from "../common/DataTable";
import VendorAppFooter from "./VendorAppFooter";

const VENDOR_UPLOADS_COLUMNS = [
  { key: "id", label: "Upload ID", isLink: true, isId: true, linkTarget: "/vendor/record" },
  { key: "filename", label: "File Name", isPrimary: true },
  { key: "created_at", label: "Upload Date", isDate: true },
  { key: "row_count", label: "Rows", isNumber: true },
  { key: "total_rules", label: "Total Rules", isNumber: true },
  { key: "passed_rules", label: "Passed", isNumber: true },
  { key: "failed_rules", label: "Failed", isNumber: true },
  { key: "duplicate_info", label: "Duplicates" },
  { key: "status", label: "Status", isBadge: true },
];

const CUSTOM_RENDERERS = {
  duplicate_info: (value) => {
    return <span className="text-[#1e293b]">{value}</span>;
  },
};

export default function VendorDashboard() {
  const { user } = useAuth();
  const [uploadsData, setUploadsData] = useState([]);
  const [uploadsLoading, setUploadsLoading] = useState(true);
  const [uploadsError, setUploadsError] = useState("");

  const loadUploads = async () => {
    let isMounted = true;

    async function fetchUploads() {
      setUploadsLoading(true);
      setUploadsError("");

      try {
        const response = await getCatalogUploads();
        if (!isMounted) return;
        const mappedData = mapCatalogUploads(response);
        // Add duplicate_info field for display
        const enrichedData = mappedData.map((upload) => ({
          ...upload,
          duplicate_info:
            upload.duplicate_count > 0
              ? `${upload.duplicate_count} (${upload.duplicate_percentage.toFixed(1)}%)`
              : "—",
        }));
        setUploadsData(enrichedData);
      } catch (error) {
        if (!isMounted) return;
        const message =
          error instanceof ApiError
            ? error.message
            : "Failed to load catalog uploads.";
        setUploadsError(message);
        setUploadsData([]);
      } finally {
        if (isMounted) {
          setUploadsLoading(false);
        }
      }
    }

    await fetchUploads();

    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {
    loadUploads();
  }, []);

  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Vendor";

  return (
    <div className="min-h-screen flex flex-col antialiased">
      <main className="flex-1 px-8 pt-6 pb-4 max-w-[1440px] w-full mx-auto flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mt-2 mb-2 w-full">
          <div>
            <span className="text-[0.95rem] font-semibold text-[#7aa0ff] block mb-0.5">
              Welcome {displayName}!
            </span>
            <h1 className="text-[2rem] font-normal text-[#1e293b] tracking-tight leading-tight">
              Vendor <strong className="font-bold">Dashboard</strong>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Refresh Button */}
            <button
              type="button"
              onClick={loadUploads}
              disabled={uploadsLoading}
              className="p-2 border border-[#e2e8f0] hover:bg-slate-100 text-[#64748b] rounded-[6px] bg-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh uploads"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={uploadsLoading ? "animate-spin" : ""}>
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="text-right leading-tight">
                <div className="text-[0.775rem] font-bold text-[#1e293b]">{user?.email || "user@example.com"}</div>
                <div className="text-[0.65rem] font-semibold text-[#64748b] uppercase tracking-wider">
                  Vendor
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-[#7aa0ff]/20 shadow-xs"
              />
            </div>
          </div>
        </div>

        {uploadsError ? (
          <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {uploadsError}
          </div>
        ) : null}

        {uploadsLoading ? (
          <section className="bg-white border border-[#e2e8f0] rounded-[14px] p-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-center text-sm text-[#64748b]">
            Loading catalog uploads...
          </section>
        ) : (
          <DataTable
            columns={VENDOR_UPLOADS_COLUMNS}
            data={uploadsData}
            totalCount={uploadsData.length}
            entityName="uploads"
            currentTable="uploads"
            customRenderers={CUSTOM_RENDERERS}
            linkTarget="/vendor/record"
          />
        )}
      </main>

      <VendorAppFooter />
    </div>
  );
}
