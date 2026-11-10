import React, { useState, useMemo } from 'react';
import { FollowerUploader } from './FollowerUploader';
import { FollowerSummaryCards } from './FollowerSummaryCards';
import { FollowerDataTable } from './FollowerDataTable';
import { FollowerDownloadButton } from './FollowerDownloadButton';
import { CustomReorderModal } from '../CustomReorderModal';
import { FollowerParseResult } from '../../types/follower';
import { parseFollowerCSV, calculateFollowerSummary } from '../../utils/followerParser';
import { ReorderMode, extractInstagramIdentifier } from '../../utils/customReorder';
import { InstagramRecord } from '../../types/instagram';
import { Users2, Info } from 'lucide-react';

export const FollowerSection: React.FC = () => {
  const [parseResult, setParseResult] = useState<FollowerParseResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Custom reorder state
  const [customOrderItems, setCustomOrderItems] = useState<string[]>([]);
  const [reorderMode, setReorderMode] = useState<ReorderMode>('username');
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);

  const handleFile = async (file: File) => {
    setIsLoading(true);
    setUploadError(null);
    try {
      const res = await parseFollowerCSV(file);
      setParseResult(res);
      setCustomOrderItems([]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses file CSV follower.';
      setUploadError(msg);
      setParseResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = async () => {
    setIsLoading(true);
    setUploadError(null);
    try {
      const res = await fetch('/follower-sample.csv');
      if (!res.ok) {
        throw new Error('File sample follower tidak dapat dimuat.');
      }
      const blob = await res.blob();
      const file = new File([blob], 'follower input example.csv', { type: 'text/csv' });
      await handleFile(file);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat sample follower CSV.';
      setUploadError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setParseResult(null);
    setUploadError(null);
    setCustomOrderItems([]);
    setIsReorderModalOpen(false);
  };

  // Reorder logic for Follower records
  const activeRecords = useMemo(() => {
    if (!parseResult) return [];
    if (customOrderItems.length === 0) return parseResult.records;

    const priorityMap = new Map<string, number>();

    if (reorderMode === 'link') {
      customOrderItems.forEach((item, idx) => {
        const id = extractInstagramIdentifier(item).toLowerCase();
        if (id) priorityMap.set(id, idx);
      });
    } else {
      customOrderItems.forEach((item, idx) => {
        const clean = item.trim().replace(/^@+/, '').toLowerCase();
        if (clean) priorityMap.set(clean, idx);
      });
    }

    const indexed = parseResult.records.map((r, origIndex) => {
      let key = '';
      if (reorderMode === 'link') {
        key = extractInstagramIdentifier(r.profileUrl).toLowerCase();
      } else {
        key = r.username.toLowerCase();
      }
      const rank = priorityMap.has(key) ? priorityMap.get(key)! : -1;
      return { record: r, origIndex, rank };
    });

    indexed.sort((a, b) => {
      if (a.rank !== -1 && b.rank !== -1) {
        if (a.rank !== b.rank) return a.rank - b.rank;
        return a.origIndex - b.origIndex;
      }
      if (a.rank !== -1) return -1;
      if (b.rank !== -1) return 1;
      return a.origIndex - b.origIndex;
    });

    return indexed.map((item) => item.record);
  }, [parseResult, customOrderItems, reorderMode]);

  const activeSummary = useMemo(() => {
    return calculateFollowerSummary(activeRecords);
  }, [activeRecords]);

  // Adapt follower records into minimal InstagramRecord format for the Reorder modal
  const modalRecords: InstagramRecord[] = useMemo(() => {
    if (!parseResult) return [];
    return parseResult.records.map((r) => ({
      id: r.id,
      username: r.username,
      videoLink: r.profileUrl,
      view: r.followersCount,
      like: r.followsCount,
      comment: null,
      share: null,
      bookmarks: null,
      raw: r.raw
    }));
  }, [parseResult]);

  return (
    <div className="space-y-6">
      {/* Intro Banner for Follower Parser */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide">CSV Follower Parser</h2>
            <p className="text-xs text-purple-200/80 mt-0.5">
              Ekstrak dan standarisasi jumlah follower, following, nama lengkap, dan status profil Instagram dari data scraping.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-purple-200/90 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
          <Info className="w-3.5 h-3.5 text-purple-400" />
          <span>Kolom: Username, Nama, Followers, Following, Link Profil, Status</span>
        </div>
      </div>

      {/* Uploader */}
      <section aria-label="Upload Section">
        <FollowerUploader
          onFileSelected={handleFile}
          isLoading={isLoading}
          currentFileName={parseResult?.fileName}
          currentFileSize={parseResult?.fileSize}
          onReset={handleReset}
          onLoadSample={handleLoadSample}
        />

        {uploadError && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            <p className="font-semibold">Error memproses file</p>
            <p className="text-xs mt-1">{uploadError}</p>
          </div>
        )}
      </section>

      {/* Active Results */}
      {parseResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Summary Cards */}
          <section aria-label="Summary Section">
            <FollowerSummaryCards summary={activeSummary} />
          </section>

          {/* Data Table */}
          <section aria-label="Follower Data Table Section">
            <FollowerDataTable
              records={activeRecords}
              onOpenReorderModal={() => setIsReorderModalOpen(true)}
              customOrderActive={customOrderItems.length > 0}
              customListCount={customOrderItems.length}
              onResetCustomOrder={() => setCustomOrderItems([])}
            />
          </section>

          {/* Download & Export */}
          <section aria-label="Follower Download Section">
            <FollowerDownloadButton
              records={activeRecords}
              onUploadAnother={handleReset}
              customOrderActive={customOrderItems.length > 0}
            />
          </section>
        </div>
      )}

      {/* Custom Reorder Modal */}
      {parseResult && (
        <CustomReorderModal
          isOpen={isReorderModalOpen}
          onClose={() => setIsReorderModalOpen(false)}
          records={modalRecords}
          activeItems={customOrderItems}
          activeMode={reorderMode}
          onApplyCustomOrder={(items, mode) => {
            setCustomOrderItems(items);
            setReorderMode(mode);
          }}
        />
      )}
    </div>
  );
};
