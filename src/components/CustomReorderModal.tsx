import React, { useState, useEffect } from 'react';
import {
  ArrowDownUp,
  X,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Link2,
  User
} from 'lucide-react';
import { InstagramRecord } from '../types/instagram';
import {
  ReorderMode,
  parseCustomInputList,
  getUniqueLinksFromRecords,
  getUniqueUsernamesFromRecords,
  applyCustomOrder
} from '../utils/customReorder';

interface CustomReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: InstagramRecord[];
  activeItems: string[];
  activeMode: ReorderMode;
  onApplyCustomOrder: (items: string[], mode: ReorderMode) => void;
}

export const CustomReorderModal: React.FC<CustomReorderModalProps> = ({
  isOpen,
  onClose,
  records,
  activeItems,
  activeMode,
  onApplyCustomOrder
}) => {
  const [mode, setMode] = useState<ReorderMode>(activeMode);
  const [inputText, setInputText] = useState('');

  // Sync state when opened
  useEffect(() => {
    if (isOpen) {
      setMode(activeMode);
      setInputText(activeItems.join('\n'));
    }
  }, [isOpen, activeItems, activeMode]);

  if (!isOpen) return null;

  const parsedItems = parseCustomInputList(inputText);
  const previewResult = applyCustomOrder(records, parsedItems, mode);

  const handleModeChange = (newMode: ReorderMode) => {
    setMode(newMode);
    // If switching mode and current input was from previous mode, optionally clear or keep
    if (newMode !== activeMode) {
      setInputText('');
    } else {
      setInputText(activeItems.join('\n'));
    }
  };

  const handleLoadExisting = () => {
    if (mode === 'link') {
      const existing = getUniqueLinksFromRecords(records);
      setInputText(existing.join('\n'));
    } else {
      const existing = getUniqueUsernamesFromRecords(records);
      setInputText(existing.join('\n'));
    }
  };

  const handleApply = () => {
    onApplyCustomOrder(parsedItems, mode);
    onClose();
  };

  const handleReset = () => {
    setInputText('');
    onApplyCustomOrder([], mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <ArrowDownUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Custom List Reordering
              </h3>
              <p className="text-xs text-slate-500">
                Urutkan data tabel dan hasil export berdasarkan daftar urutan kustom Anda.
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

        {/* Mode Selector Tabs */}
        <div className="pt-4 pb-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => handleModeChange('link')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'link'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Urutkan by Link Instagram</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('username')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'username'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Urutkan by Username</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="py-3 space-y-4 overflow-y-auto flex-1 pr-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span>
                {mode === 'link'
                  ? 'Daftar Link Instagram (1 per baris atau dipisah koma)'
                  : 'Daftar Username (1 per baris atau dipisah koma)'}
              </span>
            </label>
            <button
              type="button"
              onClick={handleLoadExisting}
              className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Isi dari {mode === 'link' ? 'Link CSV' : 'Username CSV'}
            </button>
          </div>

          <textarea
            rows={7}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              mode === 'link'
                ? `Contoh:\nhttps://www.instagram.com/reel/DfKj58RvRvk/\nhttps://www.instagram.com/reel/DfKmPuASMEU/\nhttps://www.instagram.com/p/DfKl8CmSm4s/`
                : `Contoh:\npamanjalanjalan\n@mumut.story\nmasway___`
            }
            className="w-full text-xs font-mono p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors placeholder-slate-400 leading-relaxed resize-none"
          />

          {/* Quick Stats & Feedback */}
          {parsedItems.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  {previewResult.matchedItems.length} dari {parsedItems.length} {mode === 'link' ? 'link' : 'username'} cocok di CSV
                </span>
                {previewResult.unmatchedItems.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    {previewResult.unmatchedItems.length} tidak ditemukan
                  </span>
                )}
              </div>

              {previewResult.unmatchedItems.length > 0 && (
                <p className="text-[11px] text-amber-600 bg-amber-50/60 p-2.5 rounded-lg border border-amber-100 leading-relaxed truncate">
                  Tidak ditemukan di CSV: <span className="font-semibold">{previewResult.unmatchedItems.slice(0, 3).join(', ')}{previewResult.unmatchedItems.length > 3 ? '...' : ''}</span>
                </p>
              )}
            </div>
          )}

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Cara Kerja Pengurutan:</span>
            </div>
            {mode === 'link' ? (
              <>
                <p>
                  1. Link video yang cocok akan langsung diposisikan di urutan teratas sesuai urutan baris input Anda.
                </p>
                <p>
                  2. Mendukung berbagai format link (URL lengkap reels/post, link dengan parameter <code>?igsh=...</code>, maupun shortcode saja).
                </p>
                <p>
                  3. Video/postingan yang tidak ada di dalam daftar akan tetap dipertahankan di bagian bawah.
                </p>
              </>
            ) : (
              <>
                <p>
                  1. Postingan dengan username yang tercantum akan diposisikan di paling atas sesuai urutan input.
                </p>
                <p>
                  2. Jika satu akun memiliki beberapa postingan, urutan asli antar postingannya tetap terjaga.
                </p>
                <p>
                  3. Postingan lain yang tidak tercantum akan tetap dipertahankan di bagian bawah.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {activeItems.length > 0 ? (
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
              disabled={parsedItems.length === 0}
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
