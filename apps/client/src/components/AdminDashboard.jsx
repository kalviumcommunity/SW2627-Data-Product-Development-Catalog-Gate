import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCatalogUploads, getPendingApprovals, approveCatalogUpload } from "../lib/api/catalogApi";
import { getJobsByStatus, getActiveVendors, getUploadCountsDaywise, getHealth } from "../lib/api/kpiApi";
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
  { key: "filename", label: "File Name", isPrimary: true },
  { key: "vendor_name", label: "Vendor" },
  { key: "created_at", label: "Upload Date", isDate: true },
  { key: "row_count", label: "Rows", isNumber: true },
  { key: "total_rules", label: "Total Rules", isNumber: true },
  { key: "passed_rules", label: "Passed", isNumber: true },
  { key: "failed_rules", label: "Failed", isNumber: true },
  { key: "warning_count", label: "Warnings", isNumber: true },
  { key: "duplicate_info", label: "Duplicates" },
  { key: "status", label: "Status", isBadge: true },
];

const CUSTOM_RENDERERS = {
  vendor_name: (value, row) => {
    if (!value || !row.vendor_id)
      return <span className="text-[#94a3b8]">—</span>;
    return (
      <Link
        to={`/record?table=users&id=${encodeURIComponent(row.vendor_id)}`}
        title="View vendor profile"
        className="font-medium hover:underline"
        style={{ color: "#7aa0ff", textDecoration: "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        {value}
      </Link>
    );
  },
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

// ─── Simple Chart Component ────────────────────────────────────────────────────────

function SimpleChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[#64748b] text-sm">
        No data available
      </div>
    );
  }

  const width = 600;
  const height = 130;
  const padding = 40;
  const maxCount = Math.max(...data.map(d => d.count), 1);
  
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (width - 2 * padding);
    const y = height - padding - (d.count / maxCount) * (height - 2 * padding);
    return { x, y, count: d.count, date: d.date };
  });

  // Create smooth curve using bezier curves
  const linePath = points.length > 0 
    ? `M ${points[0].x} ${points[0].y}` + 
      points.slice(1).map((p, i) => {
        const prev = points[i];
        const cpX = (prev.x + p.x) / 2;
        return ` C ${cpX} ${prev.y}, ${cpX} ${p.y}, ${p.x} ${p.y}`;
      }).join('')
    : '';

  const areaPath = linePath + ` L ${points[points.length - 1]?.x || 0} ${height - padding} L ${points[0]?.x || 0} ${height - padding} Z`;

  // Format date labels - show fewer labels for 30 days to avoid overcrowding
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Determine which labels to show based on data length
  const showAllLabels = data.length <= 10;
  const labelStep = showAllLabels ? 1 : Math.ceil(data.length / 7); // Show ~7 labels max for 30 days

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7aa0ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7aa0ff" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[20, 50, 80].map((y) => (
            <line key={y} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f1f5f9" strokeWidth="1" />
          ))}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />

          {/* Area */}
          <path d={areaPath} fill="url(#chartGradient)" />
          
          {/* Line */}
          <path d={linePath} fill="none" stroke="#7aa0ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="5"
              fill="#fff"
              stroke="#7aa0ff"
              strokeWidth="2.5"
              className="hover:r-6 transition-all cursor-pointer"
            />
          ))}
        </svg>
        
        {/* Tooltip info - show as legend */}
        <div className="absolute top-2 right-2 text-[0.7rem] text-[#64748b] bg-white/90 px-3 py-1.5 rounded-lg shadow-sm border border-[#e2e8f0]">
          Max: {maxCount.toLocaleString()}
        </div>
      </div>
      
      {/* Date labels */}
      <div className="h-[20px] flex justify-between px-2 mt-1">
        {data.map((d, i) => {
          if (showAllLabels || i % labelStep === 0 || i === data.length - 1) {
            return (
              <div key={i} className="text-[0.7rem] text-[#94a3b8] font-semibold text-center flex-1">
                {formatDate(d.date)}
              </div>
            );
          }
          return <div key={i} className="flex-1" />; // Spacer for alignment
        })}
      </div>
    </div>
  );
}



// ─── Small sub-components ─────────────────────────────────────────────────────

function ApprovalIcon({ type, color, bg }) {
  const icons = {
    monitor: <path d="M2 3h20v14H2zM8 21h8M12 17v4" />,
    box: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />,
    globe: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></>,
    warning: <><polygon points="12 2 2 22 22 22" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
  };
  return (
    <div
      style={{ background: bg, color, width: 28, height: 28, borderRadius: 6, flexShrink: 0 }}
      className="flex items-center justify-center"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icons[type]}
      </svg>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user } = useAuth();

  // Uploads table state
  const [uploadsData, setUploadsData] = useState([]);
  const [uploadsLoading, setUploadsLoading] = useState(true);
  const [uploadsError, setUploadsError] = useState("");

  // Pending approvals state
  const [pendingApprovalsData, setPendingApprovalsData] = useState([]);
  const [pendingApprovalsLoading, setPendingApprovalsLoading] = useState(true);

  // KPI data state
  const [activeJobs, setActiveJobs] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [activeVendors, setActiveVendors] = useState(0);
  const [uploadCounts, setUploadCounts] = useState([]);
  const [healthPercentage, setHealthPercentage] = useState(98.4);
  const [kpiLoading, setKpiLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [kpiError, setKpiError] = useState("");

  // Chart toggle
  const [chartRange, setChartRange] = useState("30d");

  const loadUploads = async () => {
    setUploadsLoading(true);
    setUploadsError("");
    try {
      const response = await getCatalogUploads({ vendor: true });
      const mappedData = mapCatalogUploads(response);
      const enrichedData = mappedData.map((upload) => ({
        ...upload,
        duplicate_info:
          upload.duplicate_count > 0
            ? `${upload.duplicate_count} (${upload.duplicate_percentage.toFixed(1)}%)`
            : "—",
      }));
      // Sort by created_at in descending order (most recent first)
      const sortedData = enrichedData.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setUploadsData(sortedData);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to load catalog uploads.";
      setUploadsError(message);
      setUploadsData([]);
    } finally {
      setUploadsLoading(false);
    }
  };

  const loadPendingApprovals = async () => {
    setPendingApprovalsLoading(true);
    try {
      const response = await getPendingApprovals({ vendor: true });
      const mappedData = mapCatalogUploads(response);
      // Sort by created_at in descending order (most recent first)
      const sortedData = mappedData.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setPendingApprovalsData(sortedData);
    } catch (error) {
      console.error("Failed to load pending approvals:", error);
      setPendingApprovalsData([]);
    } finally {
      setPendingApprovalsLoading(false);
    }
  };

  const handleApprove = async (uploadId) => {
    try {
      await approveCatalogUpload(uploadId);
      // Refresh data after approval
      loadPendingApprovals();
      loadUploads();
      loadKpiData();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to approve upload.";
      alert(message);
    }
  };

  const loadKpiData = async () => {
    setKpiLoading(true);
    setKpiError("");
    try {
      // Load active jobs (PENDING status)
      const activeJobsCount = await getJobsByStatus("PROCESSING", true);
      setActiveJobs(activeJobsCount);

      // Load pending approvals (APPROVAL_NEEDED status)
      const pendingCount = await getJobsByStatus("APPROVAL_NEEDED", true);
      setPendingApprovals(pendingCount);

      // Load active vendors
      const activeVendorsCount = await getActiveVendors(true);
      setActiveVendors(activeVendorsCount);

      // Load health percentage
      const healthData = await getHealth();
      setHealthPercentage(healthData.health_percentage);

      // Load upload counts for chart based on current range
      const nDays = chartRange === "7d" ? 7 : 30;
      const countsData = await getUploadCountsDaywise(nDays);
      setUploadCounts(countsData);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to load KPI data.";
      setKpiError(message);
    } finally {
      setKpiLoading(false);
    }
  };

  const loadChartData = async (range) => {
    setChartLoading(true);
    try {
      const nDays = range === "7d" ? 7 : 30;
      const countsData = await getUploadCountsDaywise(nDays);
      setUploadCounts(countsData);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to load chart data.";
      setKpiError(message);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => { 
    loadUploads(); 
    loadKpiData();
    loadPendingApprovals();
  }, []);

  useEffect(() => {
    loadChartData(chartRange);
  }, [chartRange]);

  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Admin";

  // Determine health color based on percentage
  const getHealthColor = (percentage) => {
    if (percentage >= 80) return { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", text: "#10b981", dot: "#10b981" };
    if (percentage >= 60) return { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", text: "#f59e0b", dot: "#f59e0b" };
    return { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", text: "#ef4444", dot: "#ef4444" };
  };

  const healthColor = getHealthColor(healthPercentage);

  return (
    <main className="w-full max-w-[1440px] mx-auto px-8 pt-6 pb-4 flex flex-col gap-5">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mt-2 mb-1 w-full">
        <div>
          <span className="text-[0.95rem] font-semibold text-[#7aa0ff] block mb-0.5">
            Welcome {displayName}!
          </span>
          <h1 className="text-[2rem] font-normal text-[#1e293b] tracking-tight leading-tight">
            <strong className="font-bold">Admin Dashboard</strong>
          </h1>
          <p className="text-[0.775rem] text-[#64748b] mt-0.5">
            Real-time status of your catalog pipeline and validation metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* System health badge */}
          <div 
            className="flex items-center gap-1.5 text-[0.725rem] font-bold px-3 py-1.5 rounded-full border"
            style={{
              backgroundColor: healthColor.bg,
              borderColor: healthColor.border,
              color: healthColor.text
            }}
          >
            <span 
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: healthColor.dot }}
            />
            System Quality: {healthPercentage.toFixed(1)}%
          </div>
          {/* Refresh */}
          <button
            type="button"
            onClick={() => {
              loadUploads();
              loadKpiData();
              loadPendingApprovals();
            }}
            disabled={uploadsLoading || kpiLoading}
            className="p-2 border border-[#e2e8f0] hover:bg-slate-100 text-[#64748b] rounded-[6px] bg-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh data"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={(uploadsLoading || kpiLoading) ? "animate-spin" : ""}>
              <path d="M21.5 2v6h-6" />
              <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-5">

        {/* Active Jobs */}
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.01)] flex flex-col justify-center gap-2">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[0.65rem] font-bold text-[#64748b] uppercase tracking-widest">Active Jobs</span>
              <p className="text-[2.15rem] font-bold text-[#7aa0ff] mt-0.5 leading-none tracking-tight">
                {kpiLoading ? "—" : activeJobs}
              </p>
            </div>
            <div className="w-8 h-8 rounded-[6px] bg-[rgba(122,160,255,0.08)] text-[#7aa0ff] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.01)] flex flex-col justify-center gap-2">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[0.65rem] font-bold text-[#64748b] uppercase tracking-widest">Pending Approvals</span>
              <p className="text-[2.15rem] font-bold text-[#ef4444] mt-0.5 leading-none tracking-tight">
                {kpiLoading ? "—" : String(pendingApprovals).padStart(2, '0')}
              </p>
            </div>
            <div className="w-8 h-8 rounded-[6px] bg-[rgba(245,158,11,0.08)] text-[#f59e0b] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Suppliers */}
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.01)] flex flex-col justify-center gap-2">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[0.65rem] font-bold text-[#64748b] uppercase tracking-widest">Active Suppliers</span>
              <p className="text-[2.15rem] font-bold text-[#10b981] mt-0.5 leading-none tracking-tight">
                {kpiLoading ? "—" : activeVendors}
              </p>
            </div>
            <div className="w-8 h-8 rounded-[6px] bg-[rgba(16,185,129,0.08)] text-[#10b981] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chart + Pending Approvals ─────────────────────────────────── */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1.8fr 1fr" }}>

        {/* Ingestion Volume Chart */}
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-[0.85rem] font-bold text-[#0f172a] uppercase tracking-widest">Ingestion Volume</h2>
              <p className="text-[0.725rem] text-[#64748b] mt-0.5">Daily catalog processing count ({chartRange === "7d" ? "7 days" : "30 days"})</p>
            </div>
            {/* Toggle buttons */}
            <div className="flex bg-[#f1f5f9] rounded-[6px] p-0.5 gap-0.5">
              {["7d", "30d"].map((r) => (
                <button
                  key={r}
                  onClick={() => setChartRange(r)}
                  disabled={chartLoading}
                  className="text-[0.7rem] font-semibold px-2.5 py-1 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={
                    chartRange === r
                      ? { background: "#7aa0ff", color: "#fff" }
                      : { color: "#64748b" }
                  }
                >
                  {r === "7d" ? "7 Days" : "30 Days"}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="relative flex-1" style={{ height: 160 }}>
            {chartLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-2 text-[#64748b]">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6" />
                    <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </svg>
                  <span className="text-sm">Loading chart data...</span>
                </div>
              </div>
            ) : (
              <SimpleChart data={uploadCounts} />
            )}
          </div>
        </div>

        {/* Pending Approvals list */}
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="text-[0.85rem] font-bold text-[#0f172a] uppercase tracking-widest">Pending Approvals</h2>
            <Link
              to="/workspace/ingestions?status=APPROVAL_NEEDED"
              className="text-[0.75rem] font-bold text-[#7aa0ff] hover:underline"
            >
              View All Approvals
            </Link>
          </div>

          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {pendingApprovalsLoading ? (
              <div className="flex items-center justify-center h-full text-sm text-[#64748b]">
                Loading pending approvals...
              </div>
            ) : pendingApprovalsData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-[#64748b]">
                No pending approvals
              </div>
            ) : (
              pendingApprovalsData.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-3 py-2.5 border border-[#e2e8f0] rounded-[8px] bg-[#fcfcfc] hover:bg-[#f8fafc] hover:border-[#7aa0ff]/30 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <ApprovalIcon type="file" color="#7aa0ff" bg="rgba(122,160,255,0.08)" />
                    <div>
                      <p className="text-[0.775rem] font-bold text-[#0f172a] leading-tight">{item.filename}</p>
                      <span className="text-[0.65rem] text-[#64748b] font-semibold">
                        {item.vendor_name || 'Unknown Vendor'} • {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="text-[0.7rem] font-bold text-[#10b981] bg-[rgba(16,185,129,0.08)] px-2 py-1 rounded hover:bg-[rgba(16,185,129,0.15)] transition-all"
                  >
                    Approve
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Error ────────────────────────────────────────────────────── */}
      {uploadsError && (
        <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {uploadsError}
        </div>
      )}
      {kpiError && (
        <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {kpiError}
        </div>
      )}

      {/* ── Uploads Table ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-[0.85rem] font-bold text-[#0f172a] uppercase tracking-widest mb-3">
          Latest Uploads
        </h2>
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
      </div>
    </main>
  );
}
