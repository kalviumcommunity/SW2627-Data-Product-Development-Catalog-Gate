import { useEffect, useState } from "react";
import { getCatalogUploads } from "../lib/api/catalogApi";
import { ApiError } from "../lib/api/client";
import { mapCatalogUploads } from "../lib/catalog/uploadMappers";
import DataTable from "./common/DataTable";
import FilterBuilder from "./common/FilterBuilder";

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

const HISTORY_FILTER_FIELDS = [
  {
    value: "filename",
    label: "File Name",
    type: "text",
  },
  {
    value: "status",
    label: "Status",
    type: "select",
    options: [
      {
        value: "PASSED",
        label: "Passed",
      },
      {
        value: "FAILED",
        label: "Failed",
      },
      {
        value: "PROCESSING",
        label: "Processing",
      },
    ],
  },
  {
    value: "row_count",
    label: "Rows",
    type: "number",
  },
  {
    value: "total_rules",
    label: "Total Rules",
    type: "number",
  },
  {
    value: "passed_rules",
    label: "Passed Rules",
    type: "number",
  },
  {
    value: "failed_rules",
    label: "Failed Rules",
    type: "number",
  },
  {
    value: "warning_count",
    label: "Warnings",
    type: "number",
  },
];

export default function History() {
  // Complete dataset returned by the API.
  // This is never mutated by filtering.
  const [allUploadsData, setAllUploadsData] = useState([]);

  // Dataset currently displayed in the table.
  const [uploadsData, setUploadsData] = useState([]);

  const [uploadsLoading, setUploadsLoading] = useState(true);
  const [uploadsError, setUploadsError] = useState("");

  const [conditions, setConditions] = useState([]);
  const [matchMode, setMatchMode] = useState("and");

  const loadUploads = async () => {
    setUploadsLoading(true);
    setUploadsError("");

    try {
      const response = await getCatalogUploads();

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

      setAllUploadsData(enrichedData);
      setUploadsData(enrichedData);
    } catch (error) {
      console.error("Failed to load uploads:", error);

      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to load catalog uploads.";

      setUploadsError(message);
      setAllUploadsData([]);
      setUploadsData([]);
    } finally {
      setUploadsLoading(false);
    }
  };

  useEffect(() => {
    loadUploads();
  }, []);

  const addCondition = () => {
    const firstField = HISTORY_FILTER_FIELDS[0];

    setConditions((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        field: firstField?.value || "",
        operator: "is",
        value: "",
      },
    ]);
  };

  const removeCondition = (id) => {
    setConditions((current) =>
      current.filter((condition) => condition.id !== id)
    );
  };

  const changeCondition = (id, key, value) => {
    setConditions((current) =>
      current.map((condition) =>
        condition.id === id
          ? {
              ...condition,
              [key]: value,
            }
          : condition
      )
    );
  };

  const clearFilters = () => {
    setConditions([]);
    setMatchMode("and");
    setUploadsData(allUploadsData);
  };

  const runFilter = () => {
    if (conditions.length === 0) {
      setUploadsData(allUploadsData);
      return;
    }

    // is_empty and is_not_empty legitimately don't need a value.
    const validConditions = conditions.filter((condition) => {
      if (!condition.field || !condition.operator) {
        return false;
      }

      if (
        condition.operator === "is_empty" ||
        condition.operator === "is_not_empty"
      ) {
        return true;
      }

      return (
        condition.value !== undefined &&
        condition.value !== null &&
        String(condition.value).trim() !== ""
      );
    });

    if (validConditions.length === 0) {
      setUploadsData(allUploadsData);
      return;
    }

    const filteredData = allUploadsData.filter((item) => {
      const evaluateCondition = (condition) => {
        const itemValue = item[condition.field];
        const filterValue = condition.value;

        if (condition.operator === "equals" || condition.operator === "is") {
          return String(itemValue).toLowerCase() === String(filterValue).toLowerCase();
        }
        if (condition.operator === "contains") {
          return String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase());
        }
        if (condition.operator === "is_empty") {
          return !itemValue || String(itemValue).trim() === "";
        }
        if (condition.operator === "is_not_empty") {
          return itemValue && String(itemValue).trim() !== "";
        }
        if (condition.operator === "gt") {
          return Number(itemValue) > Number(filterValue);
        }
        if (condition.operator === "lt") {
          return Number(itemValue) < Number(filterValue);
        }
        return true;
      };

      if (matchMode === "or") {
        return validConditions.some(evaluateCondition);
      }

      return validConditions.every(evaluateCondition);
    });

    setUploadsData(filteredData);
  };

  return (
    <main className="w-full max-w-[1440px] mx-auto px-8 pt-6 pb-4 flex flex-col gap-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-2 mb-2 w-full">
        <div>
          <h1 className="text-[2rem] font-normal text-[#1e293b] tracking-tight leading-tight">
            Upload <strong className="font-bold">History</strong>
          </h1>
        </div>

        {/* Refresh */}
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

      {/* Filters */}
      <FilterBuilder
        fields={HISTORY_FILTER_FIELDS}
        conditions={conditions}
        matchMode={matchMode}
        onMatchModeChange={setMatchMode}
        onAddCondition={addCondition}
        onRemoveCondition={removeCondition}
        onChangeCondition={changeCondition}
        onClearAll={clearFilters}
        onRunFilter={runFilter}
      />

      {/* Error */}
      {uploadsError && (
        <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {uploadsError}
        </div>
      )}

      {/* Upload History */}
      {uploadsLoading ? (
        <section className="bg-white border border-[#e2e8f0] rounded-[14px] p-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-center text-sm text-[#64748b]">
          Loading upload history...
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