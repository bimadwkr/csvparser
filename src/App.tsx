import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { SummaryCards } from './components/SummaryCards';
import { DataTable } from './components/DataTable';
import { ColumnMapper } from './components/ColumnMapper';
import { DownloadButton } from './components/DownloadButton';
import { CustomReorderModal } from './components/CustomReorderModal';
import { ColumnMapping, ParseResult } from './types/instagram';
import { parseInstagramCSV, buildRecordsFromRows, calculateSummary } from './utils/csvParser';
import { applyCustomUsernameOrder } from './utils/customReorder';
import { ShieldCheck, Info } from 'lucide-react';

export function App() {
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [currentMapping, setCurrentMapping] = useState<ColumnMapping | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Custom reorder state
  const [customUsernameList, setCustomUsernameList] = useState<string[]>([]);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);

  const handleFile = async (file: File) => {
    setIsLoading(true);
    setUploadError(null);
    try {
      const res = await parseInstagramCSV(file);
      setParseResult(res);
      setCurrentMapping(res.mapping);
      setRawRows(res.records.map((r) => r.raw));
      setCustomUsernameList([]); // reset custom order on new file
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to parse CSV file.';
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
      const response = await fetch('/sample.csv');
      if (!response.ok) {
        throw new Error('Sample file could not be loaded.');
      }
      const blob = await response.blob();
      const file = new File([blob], 'csv input example.csv', { type: 'text/csv' });
      await handleFile(file);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load sample CSV.';
      setUploadError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingChange = (newMapping: ColumnMapping) => {
    setCurrentMapping(newMapping);
  };

  const handleReset = () => {
    setParseResult(null);
    setRawRows([]);
    setCurrentMapping(null);
    setUploadError(null);
    setCustomUsernameList([]);
    setIsReorderModalOpen(false);
  };

  // Base records from raw data and column mapping
  const baseRecords = useMemo(() => {
    if (!parseResult || !currentMapping) return [];
    return buildRecordsFromRows(rawRows, currentMapping);
  }, [rawRows, currentMapping, parseResult]);

  // Apply custom username order if defined
  const activeRecords = useMemo(() => {
    if (customUsernameList.length === 0) return baseRecords;
    return applyCustomUsernameOrder(baseRecords, customUsernameList).reordered;
  }, [baseRecords, customUsernameList]);

  const activeSummary = useMemo(() => {
    return calculateSummary(activeRecords);
  }, [activeRecords]);

  const handleApplyCustomOrder = (newList: string[]) => {
    setCustomUsernameList(newList);
  };

  const handleResetCustomOrder = () => {
    setCustomUsernameList([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Privacy & Intro Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-rose-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide">Client-Side Secure Processing</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Your files are processed locally in your browser. No Instagram scraping data is ever sent to or stored on external servers.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            <Info className="w-3.5 h-3.5 text-rose-400" />
            <span>Output: Username, Link Video, View, Like, Comment, Share, Bookmarks</span>
          </div>
        </div>

        {/* Upload Section */}
        <section aria-label="Upload Section">
          <FileUploader
            onFileSelected={handleFile}
            isLoading={isLoading}
            currentFileName={parseResult?.fileName}
            currentFileSize={parseResult?.fileSize}
            onReset={handleReset}
            onLoadSample={handleLoadSample}
          />

          {uploadError && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              <p className="font-semibold">Error parsing file</p>
              <p className="text-xs mt-1">{uploadError}</p>
            </div>
          )}
        </section>

        {/* Active Data View */}
        {parseResult && currentMapping && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Summary Cards */}
            <section aria-label="Summary Section">
              <SummaryCards summary={activeSummary} />
            </section>

            {/* Column Mapping Configuration */}
            <section aria-label="Column Mapping Section">
              <ColumnMapper
                headers={parseResult.headers}
                mapping={currentMapping}
                onMappingChange={handleMappingChange}
                warnings={parseResult.detectedWarnings}
              />
            </section>

            {/* Data Table with Reorder Feature */}
            <section aria-label="Data Table Section">
              <DataTable
                records={activeRecords}
                onOpenReorderModal={() => setIsReorderModalOpen(true)}
                customOrderActive={customUsernameList.length > 0}
                customListCount={customUsernameList.length}
                onResetCustomOrder={handleResetCustomOrder}
              />
            </section>

            {/* Download & Export Section (CSV + Excel) */}
            <section aria-label="Download Section">
              <DownloadButton
                records={activeRecords}
                onUploadAnother={handleReset}
                customOrderActive={customUsernameList.length > 0}
              />
            </section>
          </div>
        )}
      </main>

      {/* Custom Reorder Modal */}
      {parseResult && (
        <CustomReorderModal
          isOpen={isReorderModalOpen}
          onClose={() => setIsReorderModalOpen(false)}
          records={baseRecords}
          activeCustomList={customUsernameList}
          onApplyCustomOrder={handleApplyCustomOrder}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          Instagram CSV Metrics Parser &bull; Export to CSV & Excel (.xlsx) &bull; Custom Username Reordering
        </div>
      </footer>
    </div>
  );
}

export default App;
