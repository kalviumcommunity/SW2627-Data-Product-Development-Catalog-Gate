import { useEffect, useState } from "react";
import { getUsers } from "../lib/api/usersApi";
import { ApiError } from "../lib/api/client";
import DataTable from "./common/DataTable";
import FilterBuilder from "./common/FilterBuilder";

const USERS_COLUMNS = [
  {
    key: "id",
    label: "User ID",
    isLink: true,
    isId: true,
    linkTarget: "/record?table=users",
  },
  {
    key: "name",
    label: "Name",
    isPrimary: true,
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "phone",
    label: "Phone",
  },
  {
    key: "user_role",
    label: "Role",
    isBadge: true,
  },
  {
    key: "created_at",
    label: "Created Date",
    isDate: true,
  },
];

const CUSTOM_RENDERERS = {};

const USER_FILTER_FIELDS = [
  {
    value: "name",
    label: "Name",
    type: "text",
  },
  {
    value: "email",
    label: "Email",
    type: "text",
  },
  {
    value: "phone",
    label: "Phone",
    type: "text",
  },
  {
    value: "user_role",
    label: "Role",
    type: "select",
    options: [
      {
        value: "VENDOR",
        label: "Vendor",
      },
      {
        value: "ADMIN",
        label: "Admin",
      },
    ],
  },
];

const DEFAULT_FILTER = {
  id: crypto.randomUUID(),
  field: "user_role",
  operator: "is",
  value: "VENDOR",
};

export default function Users() {
  // Complete dataset returned by the API.
  // This is never mutated by filtering.
  const [allUsersData, setAllUsersData] = useState([]);

  // Dataset currently displayed in the table.
  const [usersData, setUsersData] = useState([]);

  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  // Vendor is the default filter.
  const [conditions, setConditions] = useState([DEFAULT_FILTER]);
  const [matchMode, setMatchMode] = useState("and");

  const loadUsers = async () => {
    setUsersLoading(true);
    setUsersError("");

    try {
      const response = await getUsers();

      const users = Array.isArray(response)
        ? response
        : response?.data || [];

      setAllUsersData(users);

      // Apply the default vendor filter immediately.
      const filteredUsers = users.filter((item) =>
        String(item.user_role).toLowerCase() === String(DEFAULT_FILTER.value).toLowerCase()
      );

      setUsersData(filteredUsers);
    } catch (error) {
      console.error("Failed to load users:", error);

      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to load users.";

      setUsersError(message);
      setAllUsersData([]);
      setUsersData([]);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const addCondition = () => {
    const firstField = USER_FILTER_FIELDS[0];

    setConditions((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        field: firstField?.value || "",
        operator: "equals",
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
    setUsersData(allUsersData);
  };

  const runFilter = () => {
    if (conditions.length === 0) {
      setUsersData(allUsersData);
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
      setUsersData(allUsersData);
      return;
    }

    const filteredData = allUsersData.filter((item) => {
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
        return true;
      };

      if (matchMode === "or") {
        return validConditions.some(evaluateCondition);
      }

      return validConditions.every(evaluateCondition);
    });

    setUsersData(filteredData);
  };

  return (
    <main className="w-full max-w-[1440px] mx-auto px-8 pt-6 pb-4 flex flex-col gap-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-2 mb-2 w-full">
        <div>
          <h1 className="text-[2rem] font-normal text-[#1e293b] tracking-tight leading-tight">
            <strong className="font-bold">Vendors</strong>
          </h1>
        </div>

        {/* Refresh */}
        <button
          type="button"
          onClick={loadUsers}
          disabled={usersLoading}
          className="p-2 border border-[#e2e8f0] hover:bg-slate-100 text-[#64748b] rounded-[6px] bg-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh users"
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
            className={usersLoading ? "animate-spin" : ""}
          >
            <path d="M21.5 2v6h-6" />
            <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
        </button>
      </div>

      {/* Filters */}
      <FilterBuilder
        fields={USER_FILTER_FIELDS}
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
      {usersError && (
        <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {usersError}
        </div>
      )}

      {/* Users */}
      {usersLoading ? (
        <section className="bg-white border border-[#e2e8f0] rounded-[14px] p-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-center text-sm text-[#64748b]">
          Loading users...
        </section>
      ) : (
        <DataTable
          columns={USERS_COLUMNS}
          data={usersData}
          totalCount={usersData.length}
          entityName="users"
          currentTable="users"
          customRenderers={CUSTOM_RENDERERS}
        />
      )}
    </main>
  );
}