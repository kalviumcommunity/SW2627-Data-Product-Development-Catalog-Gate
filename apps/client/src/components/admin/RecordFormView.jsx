import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getRecordById, TABLE_SCHEMAS } from "../../data/adminMockData";

/**
 * RecordFormView Component
 * Form View for inspecting and editing a single record in a new tab.
 */
export default function RecordFormView({ tableKey: propTableKey, recordId: propRecordId }) {
  const [searchParams] = useSearchParams();

  const activeTableKey = propTableKey || searchParams.get("table") || "users";
  const activeRecordId = propRecordId || searchParams.get("id") || "";

  // Fetch initial record data
  const initialRecord = getRecordById(activeTableKey, activeRecordId);
  const schema = TABLE_SCHEMAS[activeTableKey] || TABLE_SCHEMAS.users;

  const [formData, setFormData] = useState(initialRecord || {});
  const [savedToast, setSavedToast] = useState(false);

  if (!initialRecord) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center text-center antialiased">
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
          <h2 className="text-lg font-bold text-[#1e293b] mb-1">Record Not Found</h2>
          <p className="text-xs text-[#64748b] mb-4">
            Could not locate record <code className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono text-xs">{activeRecordId}</code> in table <strong className="uppercase">{activeTableKey}</strong>.
          </p>
          <Link
            to="/admin"
            className="inline-block bg-[#7aa0ff] hover:bg-[#5c85fa] text-white font-semibold text-xs px-4 py-2 rounded-[6px] transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  // Determine Primary Title & Status
  const primaryTitle =
    formData.name || formData.filepath || formData.batch_id || formData.id;
  const statusValue = formData.status || formData.role || "Active";

  return (
    <div className="min-h-screen flex flex-col antialiased">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#10b981] text-white px-4 py-2.5 rounded-[8px] text-xs font-semibold shadow-lg flex items-center gap-2 animate-bounce">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Record successfully updated in CatalogGate database!
        </div>
      )}

      {/* Main Workspace Canvas */}
      <main className="flex-1 px-8 pt-6 pb-6 max-w-[1280px] w-full mx-auto flex flex-col gap-5">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e8f0] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748b] mb-1">
              <Link to="/admin" className="hover:text-[#7aa0ff] transition-colors">
                CatalogGate
              </Link>
              <span>/</span>
              <span className="uppercase">{activeTableKey}</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#1e293b] tracking-tight">
                {schema.label.slice(0, -1)} Form:{" "}
                <span className="font-semibold text-[#7aa0ff]">{primaryTitle}</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase bg-[rgba(122,160,255,0.1)] text-[#7aa0ff] border border-[#7aa0ff]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7aa0ff]" />
                {statusValue}
              </span>
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="bg-[#7aa0ff] hover:bg-[#5c85fa] text-white font-semibold px-5 py-2 text-xs rounded-[6px] shadow-[0_1px_3px_rgba(122,160,255,0.2)] transition-colors cursor-pointer"
            >
              Save Record
            </button>

            <Link
              to="/admin"
              className="px-3.5 py-2 border border-[#e2e8f0] hover:bg-slate-100 text-[#64748b] text-xs font-semibold rounded-[6px] bg-white transition-all"
            >
              Close View
            </Link>
          </div>
        </div>

        {/* Record Form Card */}
        <form
          onSubmit={handleSave}
          className="bg-white border border-[#e2e8f0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 md:p-8 flex flex-col gap-6"
        >
          <div className="flex justify-between items-center border-b border-[#f1f5f9] pb-3">
            <h2 className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
              {schema.label} Record Details
            </h2>
          </div>

          {/* Form Fields 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(formData).map((key) => {
              const val = formData[key];
              const isReadOnly = key === "id" || key === "created_at";

              // Format field label cleanly
              const fieldLabel = key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());

              // Check if field has predefined select options
              const schemaFieldDef = schema.fields.find((f) => f.value === key);
              const isSelectField = schemaFieldDef?.type === "select";

              return (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-[0.725rem] font-bold text-[#64748b] uppercase tracking-wider">
                    {fieldLabel}
                  </label>

                  {isSelectField ? (
                    <select
                      value={val}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-semibold border border-[#e2e8f0] rounded-[6px] bg-white text-[#1e293b] outline-none focus:border-[#7aa0ff] focus:ring-2 focus:ring-[#7aa0ff]/20 cursor-pointer mock-select"
                    >
                      {schemaFieldDef.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : isReadOnly ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={val}
                        className="w-full px-3.5 py-2 text-xs font-mono bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] text-[#475569] outline-none select-all"
                      />
                    </div>
                  ) : typeof val === "number" ? (
                    <input
                      type="number"
                      value={val}
                      onChange={(e) => handleInputChange(key, parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2 text-xs font-medium border border-[#e2e8f0] rounded-[6px] bg-white text-[#1e293b] outline-none focus:border-[#7aa0ff] focus:ring-2 focus:ring-[#7aa0ff]/20"
                    />
                  ) : (
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-medium border border-[#e2e8f0] rounded-[6px] bg-white text-[#1e293b] outline-none focus:border-[#7aa0ff] focus:ring-2 focus:ring-[#7aa0ff]/20"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-3 px-8 text-xs text-[#64748b] border-t border-[#e2e8f0] bg-transparent">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
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
            CatalogGate Enterprise Form View
          </div>
          <div>&copy; 2026 CatalogGate Enterprise. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
