import React, { useState } from 'react';
import { Download, RefreshCw, FileSpreadsheet, Users } from 'lucide-react';
import { FollowerRecord } from '../../types/follower';
import { downloadFollowerCSV, downloadFollowerExcel } from '../../utils/followerExporter';

interface FollowerDownloadButtonProps {
  records: FollowerRecord[];
  onUploadAnother: () => void;
  customOrderActive?: boolean;
}

export const FollowerDownloadButton: React.FC<FollowerDownloadButtonProps> = ({
  records,
  onUploadAnother,
  customOrderActive
}) => {
  const [downloadingFormat, setDownloadingFormat] = useState<'csv' | 'excel' | null>(null);

  const handleDownloadCSV = () => {
    setDownloadingFormat('csv');
    try {
      downloadFollowerCSV(records);
    } finally {
      setTimeout(() => setDownloadingFormat(null), 500);
    }
  };

  const handleDownloadExcel = () => {
    setDownloadingFormat('excel');
    try {
      downloadFollowerExcel(records);
    } finally {
      setTimeout(() => setDownloadingFormat(null), 500);
    }
  };

  const isDisabled = records.length === 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-900">Export Follower Siap Diunduh</h4>
            {customOrderActive && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                Custom Order Aktif
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {records.length} profil siap diexport &bull; Kolom: Username, Nama Lengkap, Followers, Following, Link Profil, Status
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
        <button
          onClick={onUploadAnother}
          type="button"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Upload File Lain</span>
        </button>

        {/* Download CSV */}
        <button
          onClick={handleDownloadCSV}
          disabled={isDisabled || downloadingFormat !== null}
          type="button"
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Download CSV (.csv)</span>
        </button>

        {/* Download Excel */}
        <button
          onClick={handleDownloadExcel}
          disabled={isDisabled || downloadingFormat !== null}
          type="button"
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 shadow-md shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Download Excel (.xlsx)</span>
        </button>
      </div>
    </div>
  );
};
