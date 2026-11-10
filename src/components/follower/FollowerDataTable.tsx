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
  X,
  ExternalLink,
  CheckCircle2,
  AlertOctagon,
  User
} from 'lucide-react';
import { FollowerRecord, FollowerSortField } from '../../types/follower';
import { formatMetricNumber } from '../../utils/formatters';

interface FollowerDataTableProps {
  records: FollowerRecord[];
  onOpenReorderModal?: () => void;
  customOrderActive?: boolean;
  customListCount?: number;
  onResetCustomOrder?: () => void;
}

export const FollowerDataTable: React.FC<FollowerDataTableProps> = ({
  records,
  onOpenReorderModal,
  customOrderActive,
  customListCount = 0,
  onResetCustomOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'found' | 'not_found'>('all');
  const [sortField, setSortField] = useState<FollowerSortField>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const handleSort = (field: NonNullable<FollowerSortField>) => {
    if (sortField === field) {
      if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else {
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

    // Filter by status tab
    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status === statusFilter);
    }

    // Filter by search
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.username.toLowerCase().includes(term) ||
          r.userFullName.toLowerCase().includes(term) ||
          r.profileUrl.toLowerCase().includes(term)
      );
    }

    // Sort
    if (sortField) {
      result = [...result].sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (valA === null || valA === undefined || valA === '') return 1;
        if (valB === null || valB === undefined || valB === '') return -1;

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
  }, [records, statusFilter, searchTerm, sortField, sortDirection]);

  // Counts for tabs
  const foundCount = useMemo(() => records.filter((r) => r.status === 'found').length, [records]);
  const notFoundCount = useMemo(() => records.filter((r) => r.status === 'not_found').length, [records]);

  // Pagination calculation
  const totalItems = filteredAndSortedRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedRecords = filteredAndSortedRecords.slice(startIndex, startIndex + pageSize);

  const renderSortIcon = (field: NonNullable<FollowerSortField>) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 ml-1.5 inline" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-purple-600 ml-1.5 inline font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-purple-600 ml-1.5 inline font-bold" />
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Toolbar & Status Tabs */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col gap-4 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Pills */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => {
                setStatusFilter('all');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({records.length})
            </button>
            <button
              onClick={() => {
                setStatusFilter('found');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'found'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Ditemukan ({foundCount})
            </button>
            <button
              onClick={() => {
                setStatusFilter('not_found');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'not_found'
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              Tidak Ditemukan ({notFoundCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenReorderModal && (
              <button
                type="button"
                onClick={onOpenReorderModal}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  customOrderActive
                    ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
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
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Pagination Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari username atau nama lengkap..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500">
            <div>
              Menampilkan <span className="font-semibold text-slate-800">{totalItems}</span> dari{' '}
              <span className="font-semibold text-slate-800">{records.length}</span> profil
            </div>

            <div className="flex items-center gap-1.5">
              <span>Per baris:</span>
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
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider sticky top-0 z-10">
              <th className="py-3 px-4 w-12 text-center text-slate-400 font-normal">#</th>
              <th className="py-3 px-3 w-12 text-center">Foto</th>
              <th
                onClick={() => handleSort('username')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors group select-none min-w-[170px]"
              >
                <div className="flex items-center">
                  <span>Username Instagram</span>
                  {renderSortIcon('username')}
                </div>
              </th>
              <th
                onClick={() => handleSort('userFullName')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors group select-none min-w-[180px]"
              >
                <div className="flex items-center">
                  <span>Nama Lengkap</span>
                  {renderSortIcon('userFullName')}
                </div>
              </th>
              <th
                onClick={() => handleSort('followersCount')}
                className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100/70 transition-colors group select-none min-w-[120px]"
              >
                <div className="flex items-center justify-end">
                  <span>Followers</span>
                  {renderSortIcon('followersCount')}
                </div>
              </th>
              <th
                onClick={() => handleSort('followsCount')}
                className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100/70 transition-colors group select-none min-w-[120px]"
              >
                <div className="flex items-center justify-end">
                  <span>Following</span>
                  {renderSortIcon('followsCount')}
                </div>
              </th>
              <th
                onClick={() => handleSort('status')}
                className="py-3 px-4 text-center cursor-pointer hover:bg-slate-100/70 transition-colors group select-none min-w-[120px]"
              >
                <div className="flex items-center justify-center">
                  <span>Status</span>
                  {renderSortIcon('status')}
                </div>
              </th>
              <th className="py-3 px-4 min-w-[180px]">Link Profil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record, index) => {
                const globalIndex = startIndex + index + 1;
                const isFound = record.status === 'found';

                return (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-3 px-4 text-center text-xs text-slate-400 font-mono">
                      {globalIndex}
                    </td>

                    {/* Avatar */}
                    <td className="py-3 px-3 text-center">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center mx-auto shrink-0">
                        {record.profilePic ? (
                          <img
                            src={record.profilePic}
                            alt={record.username}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <User className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </td>

                    {/* Username */}
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate max-w-[180px]" title={record.username}>
                          @{record.username}
                        </span>
                      </div>
                    </td>

                    {/* Full Name */}
                    <td className="py-3 px-4 text-slate-800">
                      <span className="truncate max-w-[200px] block" title={record.userFullName}>
                        {record.userFullName || (
                          <span className="text-slate-300 italic text-xs">-</span>
                        )}
                      </span>
                    </td>

                    {/* Followers */}
                    <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-purple-700">
                      {record.followersCount !== null ? (
                        formatMetricNumber(record.followersCount)
                      ) : (
                        <span className="text-slate-300 italic text-xs font-normal">-</span>
                      )}
                    </td>

                    {/* Following */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                      {record.followsCount !== null ? (
                        formatMetricNumber(record.followsCount)
                      ) : (
                        <span className="text-slate-300 italic text-xs">-</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      {isFound ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Aktif
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 cursor-help"
                          title={record.errorDescription || 'Profile does not exist'}
                        >
                          <AlertOctagon className="w-3 h-3" />
                          Tidak Ada
                        </span>
                      )}
                    </td>

                    {/* Profile Link */}
                    <td className="py-3 px-4">
                      {record.profileUrl ? (
                        <a
                          href={record.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium hover:underline truncate max-w-[180px]"
                          title={record.profileUrl}
                        >
                          <span className="truncate">{record.profileUrl}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        </a>
                      ) : (
                        <span className="text-slate-300 text-xs italic">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <Database className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-sm font-medium text-slate-600">Tidak ada profil yang cocok</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {searchTerm ? `Tidak ditemukan data untuk "${searchTerm}"` : 'Upload file CSV follower untuk menampilkan data'}
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
            Halaman <span className="font-semibold text-slate-800">{validCurrentPage}</span> dari{' '}
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
