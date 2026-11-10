import React, { useState, useEffect } from 'react';
import {
  ArrowDownUp,
  X,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { InstagramRecord } from '../types/instagram';
import {
  parseCustomUsernameList,
  getUniqueUsernamesFromRecords,
  applyCustomUsernameOrder
} from '../utils/customReorder';

interface CustomReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: InstagramRecord[];
  activeCustomList: string[];
  onApplyCustomOrder: (customList: string[]) => void;
}

export const CustomReorderModal: React.FC<CustomReorderModalProps> = ({
  isOpen,
  onClose,
  records,
  activeCustomList,
  onApplyCustomOrder
}) => {
  const [inputText, setInputText] = useState('');

  // Sync state when opened
  useEffect(() => {
    if (isOpen) {
      setInputText(activeCustomList.join('\n'));
    }
  }, [isOpen, activeCustomList]);

  if (!isOpen) return null;

  const parsedUsernames = parseCustomUsernameList(inputText);
  const previewResult = applyCustomUsernameOrder(records, parsedUsernames);

  const handleLoadExisting = () => {
    const existing = getUniqueUsernamesFromRecords(records);
    setInputText(existing.join('\n'));
  };

  const handleApply = () => {
    onApplyCustomOrder(parsedUsernames);
    onClose();
  };

  const handleReset = () => {
    setInputText('');
    onApplyCustomOrder([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <ArrowDownUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Custom Username Reordering
              </h3>
              <p className="text-xs text-slate-500">
                Urutkan data tabel dan hasil export berdasarkan daftar username kustom Anda.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1 pr-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span>Daftar Username (1 per baris atau dipisah koma)</span>
              <span className="text-[11px] font-normal text-slate-400">(@ opsional)</span>
            </label>
            <button
              type="button"
              onClick={handleLoadExisting}
              className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Isi otomatis dari CSV saat ini
            </button>
          </div>

          <textarea
            rows={7}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Contoh:\npamanjalanjalan\n@mumut.story\nmasway___\nvionaaamiraa`}
            className="w-full text-xs font-mono p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors placeholder-slate-400 leading-relaxed resize-none"
          />

          {/* Quick Stats & Feedback */}
          {parsedUsernames.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  {previewResult.matchedUsernames.length} dari {parsedUsernames.length} username ditemukan di CSV
                </span>
                {previewResult.unmatchedUsernames.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    {previewResult.unmatchedUsernames.length} tidak ada di file
                  </span>
                )}
              </div>

              {previewResult.unmatchedUsernames.length > 0 && (
                <p className="text-[11px] text-amber-600 bg-amber-50/60 p-2.5 rounded-lg border border-amber-100 leading-relaxed">
                  Username berikut tidak ditemukan di CSV saat ini:{' '}
                  <span className="font-semibold">{previewResult.unmatchedUsernames.join(', ')}</span>.
                </p>
              )}
            </div>
          )}

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Cara Kerja Pengurutan:</span>
            </div>
            <p>
              1. Postingan yang cocok dengan daftar username di atas akan ditaruh di urutan paling atas secara berurutan.
            </p>
            <p>
              2. Jika ada akun dengan beberapa postingan, urutan asli antar postingannya tetap terjaga.
            </p>
            <p>
              3. Postingan lain yang tidak tercantum di daftar akan tetap dipertahankan di bagian bawah.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {activeCustomList.length > 0 ? (
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset ke Urutan Asli
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={parsedUsernames.length === 0}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Terapkan Urutan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
