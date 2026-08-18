import React, { useEffect, useMemo, useState } from "react";
import FilterBuilder from "../common/FilterBuilder";
import DataTable from "../common/DataTable";
import { useAuth } from "../../context/AuthContext";
import { getCatalogUploads } from "../../lib/api/catalogApi";
import { ApiError } from "../../lib/api/client";
import { mapCatalogUploads } from "../../lib/catalog/uploadMappers";
import {
  TABLE_SCHEMAS,
  USERS_DATA,
  TENANTS_DATA,
} from "../../data/adminMockData";

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [selectedTable, setSelectedTable] = useState("uploads");
  const [uploadsData, setUploadsData] = useState([]);
  const [uploadsLoading, setUploadsLoading] = useState(true);
  const [uploadsError, setUploadsError] = useState("");

  const [conditions, setConditions] = useState([]);
  const [matchMode, setMatchMode] = useState("and");

  const [appliedConditions, setAppliedConditions] = useState([]);
  const [appliedMatchMode, setAppliedMatchMode] = useState("and");

  const currentSchema = TABLE_SCHEMAS[selectedTable];

  useEffect(() => {
    if (selectedTable !== "uploads") return;

    let isMounted = true;

    async function loadUploads() {
      setUploadsLoading(true);
      setUploadsError("");

      try {
        const response = await getCatalogUploads();
        if (!isMounted) return;
        setUploadsData(mapCatalogUploads(response));
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

    loadUploads();

    return () => {
      isMounted = false;
    };
  }, [selectedTable]);

  const rawDataset = useMemo(() => {
    switch (selectedTable) {
      case "users":
        return USERS_DATA;
      case "tenants":
        return TENANTS_DATA;
      case "uploads":
        return uploadsData;
      default:
        return USERS_DATA;
    }
  }, [selectedTable, uploadsData]);

  const handleTableChange = (e) => {
    const newTable = e.target.value;
    setSelectedTable(newTable);
    setConditions([]);
    setAppliedConditions([]);
  };

  const handleAddCondition = () => {
    const defaultField = currentSchema.fields[0];
    const newRow = {
      id: Math.random().toString(36).substring(2, 9),
      field: defaultField.value,
      operator: "contains",
      value: "",
    };
    setConditions((prev) => [...prev, newRow]);
  };

  const handleRemoveCondition = (id) => {
    setConditions((prev) => prev.filter((row) => row.id !== id));
  };

  const handleChangeCondition = (id, key, val) => {
    setConditions((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, [key]: val };

        if (key === "field") {
          const fieldDef = currentSchema.fields.find((f) => f.value === val);
          if (fieldDef?.type === "select") {
            updated.operator = "is";
            updated.value = fieldDef.options?.[0]?.value || "";
          } else if (fieldDef?.type === "number") {
            updated.operator = "is";
            updated.value = "";
          } else {
            updated.operator = "contains";
            updated.value = "";
          }
        }
        return updated;
      })
    );
  };

  const handleClearAll = () => {
    setConditions([]);
    setAppliedConditions([]);
  };

  const handleRunFilter = () => {
    setAppliedConditions([...conditions]);
    setAppliedMatchMode(matchMode);
  };

  const filteredData = useMemo(() => {
    if (appliedConditions.length === 0) return rawDataset;

    return rawDataset.filter((item) => {
      const evaluateRowCondition = (cond) => {
        const itemVal = item[cond.field];
        if (itemVal === undefined || itemVal === null) return false;

        const fieldDef = currentSchema.fields.find((f) => f.value === cond.field);
        const fieldType = fieldDef?.type || "text";

        if (fieldType === "number") {
          const numVal = parseFloat(cond.value);
          const itemNum = parseFloat(itemVal);
          if (isNaN(numVal) || isNaN(itemNum)) return true;
          if (cond.operator === "gt") return itemNum > numVal;
          if (cond.operator === "lt") return itemNum < numVal;
          if (cond.operator === "is") return itemNum === numVal;
          return true;
        }

        const strCondVal = String(cond.value).trim().toLowerCase();
        const strItemVal = String(itemVal).trim().toLowerCase();

        if (!strCondVal) return true;

        if (cond.operator === "is") return strItemVal === strCondVal;
        if (cond.operator === "is_not") return strItemVal !== strCondVal;
        if (cond.operator === "contains") return strItemVal.includes(strCondVal);
        if (cond.operator === "starts_with") return strItemVal.startsWith(strCondVal);

        return true;
      };

      if (appliedMatchMode === "and") {
        return appliedConditions.every(evaluateRowCondition);
      } else {
        return appliedConditions.some(evaluateRowCondition);
      }
    });
  }, [rawDataset, appliedConditions, appliedMatchMode, currentSchema]);

  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Super Admin";

  return (
    <div className="min-h-screen flex flex-col antialiased">
      <main className="flex-1 px-8 pt-6 pb-4 max-w-[1440px] w-full mx-auto flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mt-2 mb-2 w-full">
          <div>
            <span className="text-[0.95rem] font-semibold text-[#7aa0ff] block mb-0.5">
              Welcome {displayName}!
            </span>
            <h1 className="text-[2rem] font-normal text-[#1e293b] tracking-tight leading-tight">
              Super Admin <strong className="font-bold">Dashboard</strong>
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <select
              value={selectedTable}
              onChange={handleTableChange}
              className="w-44 min-w-[160px] px-4 py-1.5 pr-8 text-xs font-bold text-[#7aa0ff] bg-white border border-[#e2e8f0] rounded-[6px] outline-none cursor-pointer uppercase tracking-wider mock-select"
            >
              <option value="uploads">Uploads</option>
              <option value="users">Users</option>
              <option value="tenants">Tenants</option>
            </select>

            <div className="flex items-center gap-2.5">
              <div className="text-right leading-tight">
                <div className="text-[0.775rem] font-bold text-[#1e293b]">{displayName}</div>
                <div className="text-[0.65rem] font-semibold text-[#64748b] uppercase tracking-wider">
                  Super Admin
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                alt="Admin Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-[#7aa0ff]/20 shadow-xs"
              />
            </div>
          </div>
        </div>

        <FilterBuilder
          fields={currentSchema.fields}
          conditions={conditions}
          matchMode={matchMode}
          onMatchModeChange={setMatchMode}
          onAddCondition={handleAddCondition}
          onRemoveCondition={handleRemoveCondition}
          onChangeCondition={handleChangeCondition}
          onClearAll={handleClearAll}
          onRunFilter={handleRunFilter}
        />

        {selectedTable === "uploads" && uploadsError ? (
          <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {uploadsError}
          </div>
        ) : null}

        {selectedTable === "uploads" && uploadsLoading ? (
          <section className="bg-white border border-[#e2e8f0] rounded-[14px] p-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-center text-sm text-[#64748b]">
            Loading catalog uploads...
          </section>
        ) : (
          <DataTable
            columns={currentSchema.columns}
            data={filteredData}
            totalCount={rawDataset.length}
            entityName={currentSchema.label.toLowerCase()}
            currentTable={selectedTable}
          />
        )}
      </main>

      <footer className="mt-auto py-3 px-8 text-xs text-[#64748b] border-t border-[#e2e8f0] bg-transparent">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-semibold text-[#1e293b]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 17V7" />
              <path d="M15 17V7" />
              <path d="M9 12h6" />
            </svg>
            CatalogGate Enterprise
          </div>
          <div>&copy; 2026 CatalogGate Enterprise Operations. All systems operational.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Security Compliance
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
