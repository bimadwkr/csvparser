import React, { useState } from 'react';
import { SlidersHorizontal, Check, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { ColumnMapping, MetricKey } from '../types/instagram';
import { METRIC_DEFINITIONS } from '../utils/columnMapper';

interface ColumnMapperProps {
  headers: string[];
  mapping: ColumnMapping;
  onMappingChange: (newMapping: ColumnMapping) => void;
  warnings?: string[];
}

export const ColumnMapper: React.FC<ColumnMapperProps> = ({
  headers,
  mapping,
  onMappingChange,
  warnings = []
}) => {
  const [isOpen, setIsOpen] = useState(warnings.length > 0);

  const handleSelect = (key: MetricKey, value: string) => {
    onMappingChange({
      ...mapping,
      [key]: value
    });
  };

  const detectedCount = Object.values(mapping).filter(Boolean).length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">
                Column Mapping Configuration
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                {detectedCount} / {METRIC_DEFINITIONS.length} Mapped
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Review or customize which raw CSV columns map to each metric.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {warnings.length > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              {warnings.length} warning{warnings.length > 1 ? 's' : ''}
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-slate-200 bg-slate-50/50">
          {warnings.length > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
              {warnings.map((w, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {METRIC_DEFINITIONS.map((def) => {
              const currentVal = mapping[def.key] || '';
              const isMapped = Boolean(currentVal);

              return (
                <div
                  key={def.key}
                  className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-700">
                      {def.outputName}
                      {def.required && <span className="text-rose-500 ml-0.5">*</span>}
                    </label>
                    {isMapped ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 font-medium">
                        <Check className="w-3 h-3" /> Auto
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-medium">Missing</span>
                    )}
                  </div>

                  <select
                    value={currentVal}
                    onChange={(e) => handleSelect(def.key, e.target.value)}
                    className="w-full text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors truncate"
                  >
                    <option value="">(None / Empty column)</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
