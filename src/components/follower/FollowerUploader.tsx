import React, { useRef, useState } from 'react';
import { UploadCloud, Users, AlertCircle, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

interface FollowerUploaderProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
  currentFileName?: string;
  currentFileSize?: number;
  onReset?: () => void;
  onLoadSample?: () => void;
}

export const FollowerUploader: React.FC<FollowerUploaderProps> = ({
  onFileSelected,
  isLoading,
  currentFileName,
  currentFileSize,
  onReset,
  onLoadSample
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setErrorMsg(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      setErrorMsg('Pilih file dengan format .csv yang valid.');
      return;
    }
    if (file.size === 0) {
      setErrorMsg('File CSV yang dipilih kosong (0 bytes).');
      return;
    }
    onFileSelected(file);
  };

  return (
    <div className="w-full">
      {currentFileName ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:border-slate-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-base">{currentFileName}</span>
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Follower Data Parsed
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentFileSize !== undefined ? formatFileSize(currentFileSize) : ''} &bull; Diproses 100% di browser
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Ganti CSV Follower
            </button>
            {onReset && (
              <button
                onClick={onReset}
                title="Reset data"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer bg-white ${
            isDragOver
              ? 'border-purple-500 bg-purple-50/40 shadow-lg scale-[1.005]'
              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-sm'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleFileInputChange}
          />

          <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-105 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Upload File CSV Follower Instagram
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
            Tarik dan lepas file hasil scraping akun/follower Instagram ke sini, atau klik tombol di bawah untuk memilih file.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-colors cursor-pointer"
            >
              Pilih File CSV
            </button>

            {onLoadSample && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onLoadSample();
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-500" />
                Muat Contoh Data Follower
              </button>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <span>Mendukung kolom followersCount, followsCount, userFullName, userName, error, dll.</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mt-3.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2.5 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {isLoading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600 py-3">
          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span>Sedang menganalisis profil dan jumlah follower...</span>
        </div>
      )}
    </div>
  );
};
