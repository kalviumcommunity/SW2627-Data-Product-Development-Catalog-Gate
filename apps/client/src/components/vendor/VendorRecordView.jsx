import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCatalogUploadById } from "../../lib/api/catalogApi";
import { ApiError } from "../../lib/api/client";
import { mapCatalogUploadToRow } from "../../lib/catalog/uploadMappers";
import VendorAppFooter from "./VendorAppFooter";

/**
 * VendorRecordView Component
 * Detailed view for a single catalog upload record with comprehensive report display
 */
export default function VendorRecordView() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const uploadId = searchParams.get("id") || "";
  
  const [uploadData, setUploadData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadUploadData() {
      setLoading(true);
      setError("");

      try {
        const response = await getCatalogUploadById(uploadId);
        if (!isMounted) return;
        setUploadData(response);
      } catch (err) {
        if (!isMounted) return;
        const message =
          err instanceof ApiError
            ? err.message
            : "Failed to load upload details.";
        setError(message);
        setUploadData(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (uploadId) {
      loadUploadData();
    } else {
      setLoading(false);
      setError("No upload ID provided");
    }

    return () => {
      isMounted = false;
    };
  }, [uploadId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col antialiased">
        <main className="flex-1 px-8 pt-6 pb-6 max-w-[1280px] w-full mx-auto flex flex-col gap-5">
          <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-center text-sm text-[#64748b]">
            Loading upload details...
          </div>
        </main>
        <VendorAppFooter />
      </div>
    );
  }

  if (error || !uploadData) {
    return (
      <div className="min-h-screen flex flex-col antialiased">
        <main className="flex-1 px-8 pt-6 pb-6 max-w-[1280px] w-full mx-auto flex flex-col gap-5">
          <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-8 max-w-md w-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#1e293b] mb-1">Upload Not Found</h2>
            <p className="text-xs text-[#64748b] mb-4">
              {error || "Could not locate the requested upload record."}
            </p>
            <Link
              to="/vendor"
              className="inline-block bg-[#7aa0ff] hover:bg-[#5c85fa] text-white font-semibold text-xs px-4 py-2 rounded-[6px] transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </main>
        <VendorAppFooter />
      </div>
    );
  }

  const mappedData = mapCatalogUploadToRow(uploadData);
  const report = uploadData.reports?.[0] || {};
  const profile = report?.dataset_profiles?.[0] || {};

  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Vendor";

  return (
    <div className="min-h-screen flex flex-col antialiased">
      {/* Main Workspace Canvas */}
      <main className="flex-1 px-8 pt-6 pb-6 max-w-[1280px] w-full mx-auto flex flex-col gap-5">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e8f0] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748b] mb-1">
              <Link to="/vendor" className="hover:text-[#7aa0ff] transition-colors">
                Vendor Dashboard
              </Link>
              <span>/</span>
              <span>Upload Details</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#1e293b] tracking-tight">
                Upload:{" "}
                <span className="font-semibold text-[#7aa0ff]">#{uploadId.slice(0, 8).toUpperCase()}</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase bg-[rgba(122,160,255,0.1)] text-[#7aa0ff] border border-[#7aa0ff]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7aa0ff]" />
                {uploadData.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Profile Card */}
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

            {/* Back Button */}
            <Link
              to="/vendor"
              className="px-3 py-2 border border-[#e2e8f0] hover:bg-slate-100 text-[#64748b] text-xs font-semibold rounded-[6px] bg-white transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column - Upload Metadata */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#e2e8f0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col gap-5">
              <div className="flex justify-between items-center border-b border-[#f1f5f9] pb-3">
                <h2 className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
                  Upload Metadata
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                {/* Upload ID */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.725rem] font-bold text-[#64748b] uppercase tracking-wider">
                    Upload ID
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={uploadData.id}
                    className="w-full px-3.5 py-2 text-xs font-mono bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] text-[#475569] outline-none select-all"
                  />
                </div>

                {/* File Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.725rem] font-bold text-[#64748b] uppercase tracking-wider">
                    File Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={mappedData.filename}
                    className="w-full px-3.5 py-2 text-xs font-medium bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] text-[#475569] outline-none"
                  />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.725rem] font-bold text-[#64748b] uppercase tracking-wider">
                    Status
                  </label>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase bg-[rgba(122,160,255,0.1)] text-[#7aa0ff] border border-[#7aa0ff]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7aa0ff]" />
                    {uploadData.status}
                  </div>
                </div>

                {/* Created At */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.725rem] font-bold text-[#64748b] uppercase tracking-wider">
                    Upload Date
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={mappedData.created_at}
                    className="w-full px-3.5 py-2 text-xs font-medium bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] text-[#475569] outline-none"
                  />
                </div>

                {/* Updated At */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.725rem] font-bold text-[#64748b] uppercase tracking-wider">
                    Last Updated
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={mappedData.updated_at}
                    className="w-full px-3.5 py-2 text-xs font-medium bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] text-[#475569] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Data Quality Report */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-[#e2e8f0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col gap-5">
              <div className="flex justify-between items-center border-b border-[#f1f5f9] pb-3">
                <h2 className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
                  Data Quality Report
                </h2>
                {report.generated_at && (
                  <span className="text-xs text-[#64748b]">
                    Generated: {new Date(report.generated_at).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] p-4">
                  <div className="text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider mb-1">
                    Total Rows
                  </div>
                  <div className="text-xl font-bold text-[#1e293b]">
                    {profile.row_count?.toLocaleString() || "—"}
                  </div>
                </div>

                <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] p-4">
                  <div className="text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider mb-1">
                    Columns
                  </div>
                  <div className="text-xl font-bold text-[#1e293b]">
                    {profile.column_count?.toLocaleString() || "—"}
                  </div>
                </div>

                <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] p-4">
                  <div className="text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider mb-1">
                    Total Rules
                  </div>
                  <div className="text-xl font-bold text-[#1e293b]">
                    {report.total_rules?.toLocaleString() || "—"}
                  </div>
                </div>

                <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] p-4">
                  <div className="text-[0.7rem] font-bold text-[#64748b] uppercase tracking-wider mb-1">
                    Failed Rules
                  </div>
                  <div className="text-xl font-bold text-[#ef4444]">
                    {report.total_failed_rules?.toLocaleString() || "—"}
                  </div>
                </div>
              </div>

              {/* Validation Results */}
              <div className="border-t border-[#f1f5f9] pt-4">
                <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3">
                  Validation Results
                </h3>
                
                <div className="space-y-3">
                  {/* Passed Rules */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                      <span className="text-sm font-medium text-[#1e293b]">Passed Rules</span>
                    </div>
                    <span className="text-sm font-bold text-[#10b981]">
                      {mappedData.passed_rules?.toLocaleString() || "—"}
                    </span>
                  </div>

                  {/* Failed Rules */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                      <span className="text-sm font-medium text-[#1e293b]">Failed Rules</span>
                    </div>
                    <span className="text-sm font-bold text-[#ef4444]">
                      {mappedData.failed_rules?.toLocaleString() || "—"}
                    </span>
                  </div>

                  {/* Success Rate */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#7aa0ff]" />
                      <span className="text-sm font-medium text-[#1e293b]">Success Rate</span>
                    </div>
                    <span className="text-sm font-bold text-[#7aa0ff]">
                      {report.total_rules > 0 
                        ? `${((mappedData.passed_rules / report.total_rules) * 100).toFixed(1)}%`
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Quality Metrics */}
              <div className="border-t border-[#f1f5f9] pt-4">
                <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3">
                  Data Quality Metrics
                </h3>
                
                <div className="space-y-3">
                  {/* Duplicate Records */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#f59e0b]">
                        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                      </svg>
                      <span className="text-sm font-medium text-[#1e293b]">Duplicate Records</span>
                    </div>
                    <span className="text-sm font-bold text-[#f59e0b]">
                      {profile.duplicate_count > 0 
                        ? `${profile.duplicate_count.toLocaleString()} (${profile.duplicate_percentage.toFixed(1)}%)`
                        : "None"}
                    </span>
                  </div>

                  {/* Data Completeness */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#3b82f6]">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span className="text-sm font-medium text-[#1e293b]">Data Completeness</span>
                    </div>
                    <span className="text-sm font-bold text-[#3b82f6]">
                      {profile.row_count > 0 ? "100%" : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Blocked Rules (Failed Rules) */}
              {report.blocked && report.blocked.length > 0 && (
                <div className="border-t border-[#f1f5f9] pt-4">
                  <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3">
                    Failed Rules ({report.blocked.length})
                  </h3>
                  <div className="space-y-2">
                    {report.blocked.map((item, index) => (
                      <div key={index} className="bg-rose-50 border border-rose-200 rounded-[8px] p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-rose-800 uppercase">
                                {item.rule?.key || 'Unknown Rule'}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded bg-rose-200 text-rose-800 font-semibold">
                                {item.rule?.severity || 'HIGH'}
                              </span>
                            </div>
                            <p className="text-xs text-rose-700 mb-1">
                              {item.rule?.description || 'No description available'}
                            </p>
                            <p className="text-xs text-rose-600 italic">
                              {item.result?.message || 'No message available'}
                            </p>
                          </div>
                        </div>
                        {item.result?.failed_rows && item.result.failed_rows.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs font-semibold text-rose-800">
                              Failed Rows: {item.result.failed_rows.length}
                            </span>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.result.failed_rows.slice(0, 20).map((rowNum, i) => (
                                <span key={i} className="text-xs font-mono bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded">
                                  {rowNum}
                                </span>
                              ))}
                              {item.result.failed_rows.length > 20 && (
                                <span className="text-xs text-rose-600">
                                  +{item.result.failed_rows.length - 20} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning Rules */}
              {report.warning && report.warning.length > 0 && (
                <div className="border-t border-[#f1f5f9] pt-4">
                  <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3">
                    Warning Rules ({report.warning.length})
                  </h3>
                  <div className="space-y-2">
                    {report.warning.map((item, index) => (
                      <div key={index} className="bg-amber-50 border border-amber-200 rounded-[8px] p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-amber-800 uppercase">
                                {item.rule?.key || 'Unknown Rule'}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded bg-amber-200 text-amber-800 font-semibold">
                                {item.rule?.severity || 'MEDIUM'}
                              </span>
                            </div>
                            <p className="text-xs text-amber-700 mb-1">
                              {item.rule?.description || 'No description available'}
                            </p>
                            <p className="text-xs text-amber-600 italic">
                              {item.result?.message || 'No message available'}
                            </p>
                          </div>
                        </div>
                        {item.result?.failed_rows && item.result.failed_rows.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs font-semibold text-amber-800">
                              Affected Rows: {item.result.failed_rows.length}
                            </span>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.result.failed_rows.slice(0, 20).map((rowNum, i) => (
                                <span key={i} className="text-xs font-mono bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">
                                  {rowNum}
                                </span>
                              ))}
                              {item.result.failed_rows.length > 20 && (
                                <span className="text-xs text-amber-600">
                                  +{item.result.failed_rows.length - 20} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pipeline Errors */}
              {report.errors && report.errors.length > 0 && (
                <div className="border-t border-[#f1f5f9] pt-4">
                  <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3">
                    Pipeline Errors ({report.errors.length})
                  </h3>
                  <div className="space-y-2">
                    {report.errors.map((error, index) => (
                      <div key={index} className="bg-rose-50 border border-rose-200 rounded-[8px] p-3">
                        <p className="text-xs text-rose-800 font-medium">
                          {error}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <VendorAppFooter />
    </div>
  );
}