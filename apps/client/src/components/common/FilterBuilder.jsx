import React from "react";
import { OPERATOR_CONFIG } from "../../data/filterConfig";

export default function FilterBuilder({
  fields = [],
  conditions = [],
  matchMode = "and",
  onMatchModeChange,
  onAddCondition,
  onRemoveCondition,
  onChangeCondition,
  onClearAll,
  onRunFilter,
}) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-[#f1f5f9]">
        <span className="text-[0.75rem] font-bold text-[#64748b] uppercase tracking-wider">
          Filter Conditions
        </span>

        <div className="flex items-center gap-2 text-xs text-[#64748b] font-medium">
          <span>Match:</span>

          <select
            value={matchMode}
            onChange={(e) => onMatchModeChange?.(e.target.value)}
            className="px-3 py-1 pr-7 text-xs font-semibold border border-[#e2e8f0] rounded-[6px] bg-white text-[#1e293b] outline-none focus:border-[#7aa0ff] focus:ring-2 focus:ring-[#7aa0ff]/20 cursor-pointer"
          >
            <option value="and">All (AND)</option>
            <option value="or">Any (OR)</option>
          </select>
        </div>
      </div>

      {/* Conditions */}
      <div className="flex flex-col gap-3">
        {conditions.length === 0 ? (
          <div className="text-xs text-[#94a3b8] italic py-1">
            No filter conditions applied. Click "+ Add Condition" below to
            filter rows.
          </div>
        ) : (
          conditions.map((condition) => {
            const fieldDef =
              fields.find((field) => field.value === condition.field) ||
              fields[0];

            const fieldType = fieldDef?.type || "text";

            const operators =
              OPERATOR_CONFIG[fieldType] || OPERATOR_CONFIG.text;

            return (
              <div
                key={condition.id}
                className="flex flex-wrap items-center gap-3 w-full"
              >
                {/* Field */}
                <select
                  value={condition.field}
                  onChange={(e) =>
                    onChangeCondition(
                      condition.id,
                      "field",
                      e.target.value
                    )
                  }
                  className="w-[140px] px-3 py-2 pr-7 text-[0.825rem] font-medium border border-[#e2e8f0] rounded-[6px] bg-white text-[#1e293b] outline-none focus:border-[#7aa0ff] focus:ring-2 focus:ring-[#7aa0ff]/20 cursor-pointer"
                >
                  {fields.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>

                {/* Operator */}
                <select
                  value={condition.operator}
                  onChange={(e) =>
                    onChangeCondition(
                      condition.id,
                      "operator",
                      e.target.value
                    )
                  }
                  className="w-[150px] px-3 py-2 pr-7 text-[0.825rem] font-medium border border-[#e2e8f0] rounded-[6px] bg-white text-[#1e293b] outline-none focus:border-[#7aa0ff] focus:ring-2 focus:ring-[#7aa0ff]/20 cursor-pointer"
                >
                  {operators.map((operator) => (
                    <option
                      key={operator.value}
                      value={operator.value}
                    >
                      {operator.label}
                    </option>
                  ))}
                </select>

                {/* Value */}
                <div className="flex-1 min-w-[200px] max-w-[280px]">
                  {fieldType === "select" ? (
                    <select
                      value={condition.value}
                      onChange={(e) =>
                        onChangeCondition(
                          condition.id,
                          "value",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 pr-7 text-[0.825rem] border border-[#e2e8f0] rounded-[6px] bg-white text-[#1e293b] outline-none focus:border-[#7aa0ff] focus:ring-2 focus:ring-[#7aa0ff]/20 cursor-pointer"
                    >
                      <option value="">-- Select Value --</option>

                      {fieldDef?.options?.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : fieldType === "number" ? (
                    <input
                      type="number"
                      placeholder="Value..."
                      value={condition.value}
                      onChange={(e) =>
                        onChangeCondition(
                          condition.id,
                          "value",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 text-[0.825rem] border border-[#e2e8f0] rounded-[6px] bg-white text-[#1e293b] outline-none focus:border-[#7aa0ff] focus:ring-2 focus:ring-[#7aa0ff]/20"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. Summer..."
                      value={condition.value}
                      onChange={(e) =>
                        onChangeCondition(
                          condition.id,
                          "value",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 text-[0.825rem] border border-[#e2e8f0] rounded-[6px] bg-white text-[#1e293b] outline-none focus:border-[#7aa0ff] focus:ring-2 focus:ring-[#7aa0ff]/20"
                    />
                  )}
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => onRemoveCondition(condition.id)}
                  title="Remove condition"
                  className="w-7 h-7 flex items-center justify-center text-[#ef4444] hover:bg-[#fef2f2] rounded-[6px] transition-colors cursor-pointer"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-3 border-t border-[#f1f5f9] mt-1">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onAddCondition}
            className="flex items-center gap-1.5 px-4 py-2 border border-dashed border-[#e2e8f0] hover:border-[#7aa0ff] hover:text-[#7aa0ff] hover:bg-[#7aa0ff]/5 text-[#1e293b] text-xs font-semibold rounded-[6px] transition-all cursor-pointer"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>

            Add Condition
          </button>

          {conditions.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs font-semibold text-[#ef4444] hover:underline cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onRunFilter}
          className="bg-[#7aa0ff] hover:bg-[#5c85fa] text-white font-semibold px-5 py-2 text-xs rounded-[6px] shadow-[0_1px_3px_rgba(122,160,255,0.2)] transition-colors cursor-pointer"
        >
          Run Filter
        </button>
      </div>
    </div>
  );
}