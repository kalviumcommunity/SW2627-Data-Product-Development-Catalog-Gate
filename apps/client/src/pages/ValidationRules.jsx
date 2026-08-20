import { useEffect, useState } from "react";
import { getValidationRules } from "../lib/api/validationRulesApi";
import { ApiError } from "../lib/api/client";

export default function ValidationRules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getValidationRules();
      setRules(response);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to load validation rules.";
      setError(message);
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRules = filter === "all" 
    ? rules 
    : rules.filter(rule => rule.severity === filter);

  const severityConfig = {
    BLOCK: {
      color: "bg-rose-50 text-rose-700 border-rose-200",
      dot: "bg-rose-500",
      label: "Blocking"
    },
    WARNING: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
      label: "Warning"
    },
    INFO: {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-blue-500",
      label: "Info"
    }
  };

  const ruleCategories = {
    F: "Field Validation",
    C: "Cross-Field Validation", 
    D: "Data Quality"
  };

  const getRuleCategory = (key) => {
    const prefix = key.charAt(0);
    return ruleCategories[prefix] || "Other";
  };

  if (loading) {
    return (
      <main className="w-full max-w-[1440px] mx-auto px-8 pt-6 pb-4 flex flex-col gap-5">
        <section className="bg-white border border-[#e2e8f0] rounded-[14px] p-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-center text-sm text-[#64748b]">
          Loading validation rules...
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full max-w-[1440px] mx-auto px-8 pt-6 pb-4 flex flex-col gap-5">
        <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-[1440px] mx-auto px-8 pt-6 pb-4 flex flex-col gap-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-2 mb-2 w-full">
        <div>
          <h1 className="text-[2rem] font-normal text-[#1e293b] tracking-tight leading-tight">
            Validation <strong className="font-bold">Rules</strong>
          </h1>
          <p className="text-sm text-[#64748b] mt-1">
            View and manage catalog data validation rules
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-1.5 pr-8 text-xs font-bold text-[#7aa0ff] bg-white border border-[#e2e8f0] rounded-[6px] outline-none cursor-pointer uppercase tracking-wider mock-select"
          >
            <option value="all">All Rules</option>
            <option value="BLOCK">Blocking</option>
            <option value="WARNING">Warnings</option>
            <option value="INFO">Info</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e2e8f0] rounded-[10px] p-4">
          <div className="text-[0.65rem] uppercase tracking-wider font-bold text-[#64748b] mb-1">
            Total Rules
          </div>
          <div className="text-[1.5rem] font-bold text-[#1e293b]">
            {rules.length}
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-[10px] p-4">
          <div className="text-[0.65rem] uppercase tracking-wider font-bold text-rose-700 mb-1">
            Blocking
          </div>
          <div className="text-[1.5rem] font-bold text-rose-700">
            {rules.filter(r => r.severity === "BLOCK").length}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-[10px] p-4">
          <div className="text-[0.65rem] uppercase tracking-wider font-bold text-amber-700 mb-1">
            Warnings
          </div>
          <div className="text-[1.5rem] font-bold text-amber-700">
            {rules.filter(r => r.severity === "WARNING").length}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
          <div className="text-[0.65rem] uppercase tracking-wider font-bold text-blue-700 mb-1">
            Info
          </div>
          <div className="text-[1.5rem] font-bold text-blue-700">
            {rules.filter(r => r.severity === "INFO").length}
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="bg-white border border-[#e2e8f0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#f1f5f9]">
          <h2 className="text-[0.75rem] font-bold text-[#64748b] uppercase tracking-wider">
            Validation Rules ({filteredRules.length})
          </h2>
        </div>

        <div className="divide-y divide-[#f1f5f9]">
          {filteredRules.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-[#64748b]">
              No rules found for the selected filter.
            </div>
          ) : (
            filteredRules.map((rule) => {
              const config = severityConfig[rule.severity] || severityConfig.INFO;
              const category = getRuleCategory(rule.key);

              return (
                <div key={rule.key} className="px-6 py-4 hover:bg-[#f8fafc] transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Rule Key */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center">
                        <span className="font-mono text-sm font-bold text-[#475569]">
                          {rule.key}
                        </span>
                      </div>
                    </div>

                    {/* Rule Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[0.68rem] font-semibold text-[#94a3b8] uppercase tracking-wider">
                          {category}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[0.62rem] font-bold uppercase ${config.color}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-[#1e293b] font-medium leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
