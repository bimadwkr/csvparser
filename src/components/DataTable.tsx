import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Database,
  ArrowDownUp,
  X
} from 'lucide-react';
import { InstagramRecord, MetricKey, SortDirection, SortField } from '../types/instagram';
import { formatMetricNumber } from '../utils/formatters';

interface DataTableProps {
  records: InstagramRecord[];
  onOpenReorderModal?: () => void;
  customOrderActive?: boolean;
  customListCount?: number;
  onResetCustomOrder?: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  records,
  onOpenReorderModal,
  customOrderActive,
  customListCount = 0,
  onResetCustomOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const handleSort = (field: MetricKey) => {
    if (sortField === field) {
      if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else {
        // Reset sort
        setSortField(null);
        setSortDirection('desc');
      }
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const filteredAndSortedRecords = useMemo(() => {
    let result = records;

    // Filter by username search term
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((r) => r.username.toLowerCase().includes(term));
    }

    // Sort
    if (sortField) {
      result = [...result].sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        // Null/missing values always placed at the end
        if (valA === null && valB === null) return 0;
        if (valA === null) return 1;
        if (valB === null) return -1;

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDirection === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        const numA = Number(valA);
        const numB = Number(valB);
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      });
    }

    return result;
  }, [records, searchTerm, sortField, sortDirection]);

  // Pagination calculation
  const totalItems = filteredAndSortedRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedRecords = filteredAndSortedRecords.slice(startIndex, startIndex + pageSize);

  const renderSortIcon = (field: MetricKey) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 ml-1.5 inline" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-rose-600 ml-1.5 inline font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-rose-600 ml-1.5 inline font-bold" />
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search username..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
            />
          </div>

          {onOpenReorderModal && (
            <button
              type="button"
              onClick={onOpenReorderModal}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                customOrderActive
                  ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <ArrowDownUp className="w-3.5 h-3.5 text-purple-600" />
              <span>Reorder List</span>
              {customOrderActive && (
                <span className="ml-1 px-1.5 py-0.2 bg-purple-600 text-white rounded-full text-[10px]">
                  {customListCount}
                </span>
              )}
            </button>
          )}

          {customOrderActive && onResetCustomOrder && (
            <button
              type="button"
              onClick={onResetCustomOrder}
              title="Reset ke urutan bawaan"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Urutan</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-800">{totalItems}</span> of{' '}
            <span className="font-semibold text-slate-800">{records.length}</span> records
          </div>

          <div className="flex items-center gap-1.5">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider sticky top-0 z-10">
              <th className="py-3 px-4 w-12 text-center text-slate-400 font-normal">#</th>
              <th
                onClick={() => handleSort('username')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors group select-none"
              >
                <div className="flex items-center">
                  <span>Username Instagram</span>
                  {renderSortIcon('username')}
                </div>
              </th>
              <th
                onClick={() => handleSort('view')}
                className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100/70 transition-colors group select-none"
              >
                <div className="flex items-center justify-end">
                  <span>View</span>
                  {renderSortIcon('view')}
                </div>
              </th>
              <th
                onClick={() => handleSort('like')}
                className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100/70 transition-colors group select-none"
              >
                <div className="flex items-center justify-end">
                  <span>Like</span>
                  {renderSortIcon('like')}
                </div>
              </th>
              <th
                onClick={() => handleSort('comment')}
                className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100/70 transition-colors group select-none"
              >
                <div className="flex items-center justify-end">
                  <span>Comment</span>
                  {renderSortIcon('comment')}
                </div>
              </th>
              <th
                onClick={() => handleSort('share')}
                className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100/70 transition-colors group select-none"
              >
                <div className="flex items-center justify-end">
                  <span>Share</span>
                  {renderSortIcon('share')}
                </div>
              </th>
              <th
                onClick={() => handleSort('bookmarks')}
                className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100/70 transition-colors group select-none"
              >
                <div className="flex items-center justify-end">
                  <span>Bookmarks</span>
                  {renderSortIcon('bookmarks')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record, index) => {
                const globalIndex = startIndex + index + 1;
                return (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-3 px-4 text-center text-xs text-slate-400 font-mono">
                      {globalIndex}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 flex items-center gap-2">
                      <span className="truncate max-w-[220px]" title={record.username}>
                        {record.username ? `@${record.username.replace(/^@/, '')}` : (
                          <span className="text-slate-300 italic">Empty username</span>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-800">
                      {record.view !== null ? (
                        formatMetricNumber(record.view)
                      ) : (
                        <span className="text-slate-300 text-xs italic">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-800">
                      {record.like !== null ? (
                        formatMetricNumber(record.like)
                      ) : (
                        <span className="text-slate-300 text-xs italic">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-800">
                      {record.comment !== null ? (
                        formatMetricNumber(record.comment)
                      ) : (
                        <span className="text-slate-300 text-xs italic">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-800">
                      {record.share !== null ? (
                        formatMetricNumber(record.share)
                      ) : (
                        <span className="text-slate-300 text-xs italic">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-800">
                      {record.bookmarks !== null ? (
                        formatMetricNumber(record.bookmarks)
                      ) : (
                        <span className="text-slate-300 text-xs italic">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <Database className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-sm font-medium text-slate-600">No matching records found</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {searchTerm
                        ? `No results matching "${searchTerm}"`
                        : 'Upload a CSV file to preview data'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <span className="font-semibold text-slate-800">{validCurrentPage}</span> of{' '}
            <span className="font-semibold text-slate-800">{totalPages}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validCurrentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-slate-700">
              {validCurrentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
