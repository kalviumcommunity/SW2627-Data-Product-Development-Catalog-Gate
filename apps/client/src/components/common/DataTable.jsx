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

    if (col.isLink || col.isId) {
      const recordId = row.id || row.batch_id || rawVal;
      return (
        <Link
          to={`/record?table=${currentTable}&id=${encodeURIComponent(recordId)}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Open Record Form View in new tab"
          className="font-semibold text-[#7aa0ff] hover:underline cursor-pointer"
        >
          {rawVal}
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
      return (
        <span className="font-medium text-[#1e293b]">
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
                  className="hover:bg-[#f8fafc] transition-colors"
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
