import React from "react";
import { Link } from "react-router-dom";

/**
 * DataTable Component
 * Reusable data grid table matching docs/mock.
 */
export default function DataTable({
  columns = [],
  data = [],
  totalCount = 0,
  entityName = "records",
  currentTable = "users",
  customRenderers = {},
  linkTarget = "/record",
}) {
  const getBadgeStyle = (value) => {
    const val = String(value).toUpperCase();
    if (["COMPLETED", "SUPER_ADMIN", "VALIDATED", "ACTIVE"].includes(val)) {
      return {
        dot: "bg-[#10b981]",
        badge: "bg-[rgba(16,185,129,0.08)] text-[#10b981]",
      };
    }
    if (["PROCESSING", "CATALOG_ADMIN", "PRO"].includes(val)) {
      return {
        dot: "bg-[#3b82f6]",
        badge: "bg-[rgba(59,130,246,0.08)] text-[#3b82f6]",
      };
    }
    if (["PENDING", "VENDOR", "ONBOARDING"].includes(val)) {
      return {
        dot: "bg-[#f59e0b]",
        badge: "bg-[rgba(245,158,11,0.08)] text-[#f59e0b]",
      };
    }
    if (["FAILED", "SUSPENDED", "INACTIVE"].includes(val)) {
      return {
        dot: "bg-[#ef4444]",
        badge: "bg-[rgba(239,68,68,0.08)] text-[#ef4444]",
      };
    }
    return {
      dot: "bg-[#64748b]",
      badge: "bg-[#f1f5f9] text-[#64748b]",
    };
  };

  const renderCellContent = (row, col) => {
    const rawVal = row[col.key];

    // Check for custom renderer first
    if (customRenderers[col.key]) {
      return customRenderers[col.key](rawVal, row);
    }

    if (col.isLink || col.isId) {
      const recordId = row.id || rawVal;
      // For vendor uploads, show a shortened version of the ID
      let displayId = rawVal;
      if (typeof rawVal === "string" && rawVal.length > 8) {
        displayId = `#${rawVal.slice(0, 8).toUpperCase()}`;
      }
      const targetLink = col.linkTarget || linkTarget;
      // Build query params - if targetLink already has table parameter, only append ID
      const hasTableParam = targetLink.includes('table=');
      const queryParams = hasTableParam
        ? `&id=${encodeURIComponent(recordId)}`
        : (currentTable 
          ? `?table=${encodeURIComponent(currentTable)}&id=${encodeURIComponent(recordId)}`
          : `?id=${encodeURIComponent(recordId)}`);
      
      return (
        <Link
          to={`${targetLink}${queryParams}`}
          title="Open Record View"
          className="font-semibold cursor-pointer hover:underline"
          style={{ 
            color: '#7aa0ff',
            textDecoration: 'none'
          }}
        >
          {displayId}
        </Link>
      );
    }

    if (col.isPrimary) {
      return <span className="font-semibold text-[#1e293b]">{rawVal}</span>;
    }

    if (col.isCode) {
      return (
        <span className="font-mono text-xs bg-[#f8fafc] text-[#334155] px-2 py-0.5 rounded border border-[#e2e8f0]">
          {rawVal}
        </span>
      );
    }

    if (col.isBadge) {
      const style = getBadgeStyle(rawVal);
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[0.75rem] font-bold tracking-wide uppercase ${style.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {rawVal}
        </span>
      );
    }

    if (col.isNumber) {
      if (rawVal === null || rawVal === undefined || rawVal === "") {
        return <span className="text-[#94a3b8]">—</span>;
      }
      // Add color coding for passed/failed rules
      let className = "font-medium text-[#1e293b]";
      if (col.key === "passed_rules" && rawVal > 0) {
        className = "font-medium text-[#10b981]";
      } else if (col.key === "failed_rules" && rawVal > 0) {
        className = "font-medium text-[#ef4444]";
      }
      return (
        <span className={className}>
          {typeof rawVal === "number" ? rawVal.toLocaleString() : rawVal}
        </span>
      );
    }

    if (col.isDate) {
      return <span className="text-[#64748b] text-xs">{rawVal}</span>;
    }

    return <span className="text-[#1e293b]">{rawVal}</span>;
  };

  return (
    <section className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col flex-1 overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto overflow-y-auto flex-1 w-full">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="border-b border-[#e2e8f0]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3 text-[0.75rem] font-bold text-[#64748b] uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-[#94a3b8] font-medium text-xs whitespace-nowrap"
                >
                  No matching records found. Try adjusting or clearing filter conditions.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={row.id || row.batch_id || idx}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-2.5 text-[0.85rem] whitespace-nowrap">
                      {renderCellContent(row, col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination */}
      <div className="flex justify-between items-center pt-4 mt-4 border-t border-[#f1f5f9] text-xs text-[#64748b]">
        <span>
          Showing {data.length} of {totalCount} {entityName}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center border border-[#e2e8f0] rounded-[6px] hover:bg-[#f1f5f9] text-[#64748b] transition-colors cursor-pointer"
            aria-label="Previous page"
          >
            ⟨
          </button>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center border border-[#e2e8f0] rounded-[6px] hover:bg-[#f1f5f9] text-[#64748b] transition-colors cursor-pointer"
            aria-label="Next page"
          >
            ⟩
          </button>
        </div>
      </div>
    </section>
  );
}
