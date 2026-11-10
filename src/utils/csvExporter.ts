import Papa from 'papaparse';
import { InstagramRecord } from '../types/instagram';
import { formatDateISO } from './formatters';

export const CSV_OUTPUT_COLUMNS = [
  'Username Instagram',
  'Link Video Instagram',
  'View',
  'Like',
  'Comment',
  'Share',
  'Bookmarks'
] as const;

/**
 * Generate standardized CSV content with UTF-8 BOM
 */
export function generateCleanCSV(records: InstagramRecord[]): string {
  const rows = records.map((record) => ({
    'Username Instagram': record.username,
    'Link Video Instagram': record.videoLink || '',
    'View': record.view !== null ? record.view : '',
    'Like': record.like !== null ? record.like : '',
    'Comment': record.comment !== null ? record.comment : '',
    'Share': record.share !== null ? record.share : '',
    'Bookmarks': record.bookmarks !== null ? record.bookmarks : ''
  }));

  const csvBody = Papa.unparse(rows, {
    columns: [...CSV_OUTPUT_COLUMNS],
    quotes: false,
    header: true,
    newline: '\r\n'
  });

  // Prepend UTF-8 BOM (\uFEFF) for Microsoft Excel compatibility
  return '\uFEFF' + csvBody;
}

/**
 * Trigger download of the cleaned CSV in the browser
 */
export function downloadCleanCSV(records: InstagramRecord[], customFilename?: string): void {
  const csvContent = generateCleanCSV(records);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const dateStr = formatDateISO();
  const filename = customFilename || `instagram_metrics_clean_${dateStr}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
